import supertest from 'supertest';
import app from '../../src/index';
import * as newGoal from '../mock-data/new-goal.json';

const endpointUrl = '/goals/';
const rootEndpointUrl = '/';
const nonExistingGoalId = 765674;
const testData = {
  title: 'Make integration test for PUT',
  description: 'Write the test',
  complete: true
};

const patchTestData = {
  complete: false
};

let firstGoal, newGoalId;

describe(rootEndpointUrl, () => {
  it('GET ' + rootEndpointUrl, async () => {
    const response = await supertest(app).get(rootEndpointUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeType('object');
    expect(response.body).toBeTruthy();
  });

  it('GET ' + endpointUrl, async () => {
    const response = await supertest(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[1].title).toBeDefined();
    expect(response.body[1].description).toBeDefined();
    expect(response.body[1].complete).toBeDefined();
    firstGoal = response.body[1];
  });

  it('GET by Id ' + endpointUrl + ':goalId', async () => {
    const response = await supertest(app).get(endpointUrl + firstGoal.id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstGoal.title);
    expect(response.body.description).toBe(firstGoal.description);
    expect(response.body.complete).toBe(firstGoal.complete);
  });

  it(`GET goal by id doesn't exist` + endpointUrl + `:goalId`, async () => {
    const response = await supertest(app).get(
      endpointUrl + nonExistingGoalId
    );
    expect(response.statusCode).toBe(404);
  });

  it('POST ' + endpointUrl, async () => {
    const response = await supertest(app)
      .post(endpointUrl)
      .send(newGoal);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newGoal.title);
    expect(response.body.description).toBe(newGoal.description);
    expect(response.body.complete).toBe(newGoal.complete);
    newGoalId = response.body.id;
  });

  it('should return error 500 on malformed data with POST' + endpointUrl,
    async () => {
      const response = await supertest(app)
        .post(endpointUrl)
        .send({ title: 'Missing complete property' });
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: 'Goal validation failed: `title, `complete` and `description` are required.'
      });
    }
  );

  it('PATCH ' + endpointUrl + ':goalId' + '/complete', async () => {
    const res = await supertest(app)
      .patch(endpointUrl + newGoalId + '/complete')
      .send(patchTestData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(newGoal.title);
    expect(res.body.description).toBe(newGoal.description);
    expect(res.body.complete).toBe(patchTestData.complete);
  });

  it('should return 404 on PATCH ' + endpointUrl, async () => {
    const res = await supertest(app)
      .patch(endpointUrl + nonExistingGoalId + '/complete')
      .send(patchTestData.complete);
    expect(res.statusCode).toBe(404);
  });

  it('PUT ' + endpointUrl, async () => {
    const res = await supertest(app)
      .put(endpointUrl + newGoalId)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.description).toBe(testData.description);
    expect(res.body.complete).toBe(testData.complete);
  });

  it('should return 404 on PUT ' + endpointUrl, async () => {
    const res = await supertest(app)
      .put(endpointUrl + nonExistingGoalId)
      .send(testData);
    expect(res.statusCode).toBe(404);
  });

  it('HTTP DELETE', async () => {
    const res = await supertest(app)
      .delete(endpointUrl + newGoalId)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.description).toBe(testData.description);
    expect(res.body.complete).toBe(testData.complete);
  });

  it('HTTP DELETE 404', async () => {
    const res = await supertest(app)
      .delete(endpointUrl + nonExistingGoalId)
      .send();
    expect(res.statusCode).toBe(404);
  });
});

expect.extend({
  toBeType(received, argument) {
    const initialType = typeof received;
    const type = initialType === 'object' ? Array.isArray(received) ? 'array' : initialType : initialType;
    return type === argument ? {
      message: () => `expected ${received} to be type ${argument}`,
      pass: true
    } : {
        message: () => `expected ${received} to be type ${argument}`,
        pass: false
      };
  }
});