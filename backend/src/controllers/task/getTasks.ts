import { taskSchema } from '../../db/schemas/taskSchema.js';
import { TasksType } from '../../types/tasksType.js';
import { getUser } from '../../utils/index.js';
import { Request, Response } from 'express';

taskSchema.statics.getTasks = async function (req: Request, res: Response) {
  const user = getUser(req);
  const tasksType = req.params.tasksType as TasksType;
  const findQuery: { [k in TasksType]: any } = {
    public: { public: true },
    own: { owner: user._id },
    shared: { members: user._id },
  };
  this.find(findQuery[tasksType])
    .sort({ _id: -1 })
    .populate('steps')
    .then((tasks) => {
      res.status(200).json({
        tasks,
        tasksType,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: err.message,
      });
    });
};
