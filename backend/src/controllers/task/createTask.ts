import { taskSchema } from '../../db/schemas/taskSchema.js';
import { getUser } from '../../utils/index.js';
import { Request, Response } from 'express';

taskSchema.statics.createTask = async function (req: Request, res: Response) {
  const user = getUser(req);
  const task = await this.create({ ...req.body, owner: user._id });

  task
    .populate('steps')
    .then((task) => {
      res.status(201).json(task);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: true,
        message: err,
      });
    });
};
