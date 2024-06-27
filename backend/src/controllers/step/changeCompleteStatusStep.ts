import { Request, Response } from 'express';
import { StepModel } from '../../db/schemas/stepSchema.js';
import { getUser } from '../../utils/index.js';
import { Types } from 'mongoose';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';

export default async function changeCompleteStatusStep(
  req: Request,
  res: Response
): Promise<void> {
  const user = getUser(req);
  const stepId = new Types.ObjectId(req.params.stepId);

  const step = await StepModel.findOne({ _id: stepId, owner: user._id });
  if (!step) {
    return Promise.reject({ message: 'Шаг не найден' });
  }
  step.complete = !step.complete;
  step
    .save()
    .then((step) => {
      resSuccess(res, responseSuccessData.updateDataSuccess, { step });
    })
    .catch((err) => {
      resError(res, responseErrorData.errorUpdateData);
    });
}
