import { Router } from 'express';
import { StepModel } from '../db/schemas/stepSchema.js';
import { getUser } from '../utils/index.js';
import { Types } from 'mongoose';

const stepRouter = Router();

stepRouter.delete(`/deleteStep/:stepId`, (req, res) => {
  StepModel.deleteStep(req, res);
});

stepRouter.patch(`/changeCompleteStatusStep/:stepId`, (req, res) => {
  StepModel.changeCompleteStatusStep(req, res);
});

export default stepRouter;
