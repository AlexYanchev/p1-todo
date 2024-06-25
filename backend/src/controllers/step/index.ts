import { Request, Response } from 'express';
import { stepSchema } from '../../db/schemas/stepSchema.js';
import { getUser } from '../../utils/index.js';
import { Types } from 'mongoose';

stepSchema.statics.deleteStep = async function (
  req: Request,
  res: Response
): Promise<void> {
  const user = getUser(req);
  const stepId = req.params.stepId;
  this.findOneAndDelete({ owner: user._id, _id: stepId })
    .then((response) => {
      res.status(200).json({
        success: true,
        message: 'Шаг удален',
        taskId: response?.taskId,
        stepId: response?._id,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: 'Ошибка удаления шага',
      });
    });
};

stepSchema.statics.changeCompleteStatusStep = async function (
  req: Request,
  res: Response
): Promise<void> {
  const user = getUser(req);
  const stepId = new Types.ObjectId(req.params.stepId);

  const step = await this.findOne({ _id: stepId, owner: user._id });
  if (!step) {
    return Promise.reject({ message: 'Шаг не найден' });
  }
  step.complete = !step.complete;
  step
    .save()
    .then((step) => {
      res
        .status(201)
        .json({ success: true, message: 'Задача завершена', step });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: true, message: 'Ошибка завершения задачи' });
    });
};
