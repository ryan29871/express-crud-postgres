import { Router } from 'express';
import * as goalController from '../controllers/goal.controller';

const router = Router();

router.post('/', goalController.createGoal);

router.get('/', goalController.getGoals);

router.get('/:goalId', goalController.getGoalById);

router.patch('/:goalId/complete', goalController.updateGoal);

router.put('/:goalId', goalController.replaceGoal);

router.delete('/:goalId', goalController.deleteGoal);

export default router;