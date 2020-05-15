import GoalModel from '../services/goals.service';

export async function createGoal(req, res, next) {
  try {
    const goal = await GoalModel.create(req.body);
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

export async function deleteGoal(req, res, next) {
  try {
    const goal = await GoalModel.findByIdAndDelete(req.params.goalId);
    if (goal) {
      res.status(200).json(goal);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

export async function getGoalById(req, res, next) {
  try {
    const goal = await GoalModel.findById(req.params.goalId);
    if (goal) {
      res.status(200).json(goal);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

export async function getGoals(req, res, next) {
  try {
    const goals = await GoalModel.findAll();
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

export async function replaceGoal(req, res, next) {
  try {
    const goal = await GoalModel.findByIdAndReplace(
      req.params.goalId,
      req.body
    );
    if (goal) {
      res.status(200).json(goal);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

export async function updateGoal(req, res, next) {
  try {
    const goal = await GoalModel.findByIdAndUpdate(
      req.params.goalId,
      req.body
    );
    if (goal) {
      res.status(200).json(goal);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

