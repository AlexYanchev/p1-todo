import { Router } from 'express';
import changeCompleteStatusStep from '../controllers/step/changeCompleteStatusStep.js';
import deleteStep from '../controllers/step/deleteStep.js';
import { resError, responseErrorData } from '../helpers/response/resError.js';

const stepRouter = Router();

stepRouter.delete(`/deleteStep/:stepId`, async (req, res) => {
  try {
    await deleteStep(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

stepRouter.patch(`/changeCompleteStatusStep/:stepId`, async (req, res) => {
  try {
    await changeCompleteStatusStep(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

export default stepRouter;
