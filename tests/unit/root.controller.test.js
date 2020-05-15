import * as rootController from '../../src/controllers/root.controller';
import * as httpMocks from 'node-mocks-http';

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('RootController.getRoot', () => {
  it('should have a getRoot function', () => {
    expect(typeof rootController.getRoot).toBe('function');
  });

  it('should return response with status 200 and data', () => {
    rootController.getRoot(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({ data: 'Welcome to my CRUD app!' });
  });
});