import { Types } from 'mongoose';
import { StepModel } from '../../db/schemas/stepSchema.js';
import { taskSchema } from '../../db/schemas/taskSchema.js';
import { getUser } from '../../utils/index.js';
import { Request, Response } from 'express';

taskSchema.statics.addStepToTask = async function (
  req: Request,
  res: Response
) {
  const user = getUser(req);
  const taskId = new Types.ObjectId(req.params.id);
  const shared = req.params.shared === 'shared';
  const title = req.body.title as string;

  const addStep = (
    title: string,
    taskId: Types.ObjectId,
    owner: Types.ObjectId
  ) => {
    StepModel.addStep({ title, taskId, owner })
      .then((step) => {
        res.status(201).json({ success: true, message: 'Шаг добавлен', step });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ error: true, message: 'Ошибка добавления шага' });
      });
  };

  if (shared) {
    const task = await this.findOne({ _id: taskId });
    if (task && task.members.includes(user._id)) {
      addStep(title, taskId, user._id);
    } else {
      res.status(400).json({ error: true, message: 'Ошибка добавления шага' });
    }
  } else {
    addStep(title, taskId, user._id);
  }
};
