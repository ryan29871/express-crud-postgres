import * as httpMocks from 'node-mocks-http';
import * as goalController from '../../src/controllers/goal.controller';
import GoalModel from '../../src/services/goals.service';
import * as goals from '../mock-data/all-goals.json';
import * as newGoal from '../mock-data/new-goal.json';

const goalId = '5eb9f1d87ed4d639701bb4be';
let req, res, next;

GoalModel.create = jest.fn();
GoalModel.findAll = jest.fn();
GoalModel.findById = jest.fn();
GoalModel.findByIdAndDelete = jest.fn();
GoalModel.findByIdAndReplace = jest.fn();
GoalModel.findByIdAndUpdate = jest.fn();
// jest.mock('../../src/services/goals.service');

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('goalController.getGoals', () => {
  it('should have a getGoals function', () => {
    expect(typeof goalController.getGoals).toBe('function');
  });

  it('should call GoalModel.findAll()', async () => {
    await goalController.getGoals(req, res, next);
    expect(GoalModel.findAll).toHaveBeenCalledWith();
  });

  it('should return response with status 200 and all goals', async () => {
    await GoalModel.findAll.mockReturnValue(goals);
    await goalController.getGoals(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(goals);
  });

  it('should handle errors in getGoals', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejectedPromise = Promise.reject(errorMessage);
    await GoalModel.findAll.mockReturnValue(rejectedPromise);
    await goalController.getGoals(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('goalController.getGoalById', () => {
  it('should have a getGoalById', () => {
    expect(typeof goalController.getGoalById).toBe('function');
  });

  it('should call GoalModel.findById with route parameters', async () => {
    req.params.goalId = goalId;
    await goalController.getGoalById(req, res, next);
    expect(await GoalModel.findById).toBeCalledWith(goalId);
  });

  it('should return json body and response code 200', async () => {
    await GoalModel.findById.mockReturnValue(newGoal);
    await goalController.getGoalById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newGoal);
  });

  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding goalModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    GoalModel.findById.mockReturnValue(rejectedPromise);
    await goalController.getGoalById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});


describe('goalController.createGoal', () => {
  beforeEach(() => {
    req.body = newGoal;
  });

  it('should have a createGoal function', () => {
    expect(typeof goalController.createGoal).toBe('function');
  });

  it('should call GoalModel.create', () => {
    goalController.createGoal(req, res, next);
    expect(GoalModel.create).toBeCalledWith(newGoal);
  });

  it('should return 201 response code', async () => {
    await goalController.createGoal(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return json body in response', async () => {
    GoalModel.create.mockReturnValue(newGoal);
    await goalController.createGoal(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newGoal);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Complete property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    GoalModel.create.mockReturnValue(rejectedPromise);
    await goalController.createGoal(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  describe('goalController.updateGoal', () => {
    it('should have a updateGoal function', () => {
      expect(typeof goalController.updateGoal).toBe('function');
    });

    it('should update with GoalModel.findByIdAndUpdate', async () => {
      req.params.goalId = goalId;
      req.body = newGoal;
      await goalController.updateGoal(req, res, next);
      expect(GoalModel.findByIdAndUpdate).toHaveBeenCalledWith(goalId, newGoal);
    });

    it('should return a response with json data and http code 200', async () => {
      req.params.goalId = goalId;
      req.body = newGoal;
      GoalModel.findByIdAndUpdate.mockReturnValue(newGoal);
      await goalController.updateGoal(req, res, next);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(newGoal);
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error' };
      const rejectedPromise = Promise.reject(errorMessage);
      GoalModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
      await goalController.updateGoal(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('goalController.replaceGoal', () => {
    it('should have a replaceGoal function', () => {
      expect(typeof goalController.replaceGoal).toBe('function');
    });

    it('should update with GoalModel.findByIdAndReplace', async () => {
      req.params.goalId = goalId;
      req.body = newGoal;
      await goalController.replaceGoal(req, res, next);
      expect(GoalModel.findByIdAndReplace).toHaveBeenCalledWith(goalId, newGoal);
    });

    it('should return a response with json data and http code 200', async () => {
      req.params.goalId = goalId;
      req.body = newGoal;
      GoalModel.findByIdAndReplace.mockReturnValue(newGoal);
      await goalController.replaceGoal(req, res, next);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(newGoal);
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error' };
      const rejectedPromise = Promise.reject(errorMessage);
      GoalModel.findByIdAndReplace.mockReturnValue(rejectedPromise);
      await goalController.replaceGoal(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('goalController.deleteGoal', () => {
    it('should have a deleteGoal function', () => {
      expect(typeof goalController.deleteGoal).toBe('function');
    });

    it('should call findByIdAndDelete', async () => {
      req.params.goalId = goalId;
      await goalController.deleteGoal(req, res, next);
      expect(GoalModel.findByIdAndDelete).toBeCalledWith(goalId);
    });

    it('should return 200 OK and deleted goalmodel', async () => {
      GoalModel.findByIdAndDelete.mockReturnValue(newGoal);
      await goalController.deleteGoal(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(newGoal);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error deleting' };
      const rejectedPromise = Promise.reject(errorMessage);
      GoalModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
      await goalController.deleteGoal(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle 404', async () => {
      GoalModel.findByIdAndDelete.mockReturnValue(null);
      await goalController.deleteGoal(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });
  });
});