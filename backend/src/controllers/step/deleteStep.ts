import { Request, Response } from 'express';
import { StepModel } from '../../db/schemas/stepSchema.js';
import { getUser } from '../../utils/index.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';

export default async function deleteStep(
  req: Request,
  res: Response
): Promise<void> {
  const user = getUser(req);
  const stepId = req.params.stepId;
  StepModel.findOneAndDelete({ owner: user._id, _id: stepId })
    .then((response) => {
      resSuccess(res, responseSuccessData.deleteDataSuccess, {
        taskId: response?.taskId,
        stepId: response?._id,
      });
    })
    .catch((error) => {
      resError(res, responseErrorData.errorDeleteData);
    });
}
