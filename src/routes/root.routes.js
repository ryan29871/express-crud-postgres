import { Router } from 'express';
import * as rootController from '../controllers/root.controller';

const router = Router()

router.get('/', rootController.getRoot)

export default router;