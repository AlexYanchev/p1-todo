import { Router } from 'express';
import { StepModel } from '../db/schemas/stepSchema.js';
import { validateToken, getUser } from '../utils/index.js';
import { Types } from 'mongoose';

const stepRouter = Router();

stepRouter.delete(`/deleteStep/:stepId`, (req, res) => {
  const user = getUser(req);
  const stepId = req.params.stepId;
  StepModel.findOneAndDelete({ owner: user._id, _id: stepId })
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
});

stepRouter.patch(`/changeCompleteStatusStep/:stepId`, (req, res) => {
  const user = getUser(req);
  const stepId = new Types.ObjectId(req.params.stepId);
  StepModel.changeCompleteStatusStep(stepId, user._id)
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
});

export default stepRouter;
