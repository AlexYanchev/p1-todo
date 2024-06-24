import { NextFunction, Request, Response, Router } from 'express';
import { TaskModel, TaskType } from '../db/schemas/taskSchema.js';
import { tokenizer } from '../db/utils/index.js';
import { TasksType } from '../types/tasksType.js';
import { UserType } from '../db/schemas/userSchema.js';
import { StepModel, StepType } from '../db/schemas/stepSchema.js';
import { Types } from 'mongoose';
import { validateToken, getUser } from '../utils/index.js';

const taskRouter = Router();

taskRouter.post('/createTask', (req, res) => {
  TaskModel.createTask({ ...req.body, owner: req.body.userDecoded._id })
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
});

taskRouter.get('/getTasks/:tasksType', (req, res) => {
  const user = getUser(req);
  const tasksType = req.params.tasksType as TasksType;
  const findQuery: { [k in TasksType]: any } = {
    public: { public: true },
    own: { owner: user._id },
    shared: { members: user._id },
  };
  TaskModel.find(findQuery[tasksType])
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
});

taskRouter.delete('/deleteTask/:id', (req, res) => {
  const user = getUser(req);
  const _id = req.params.id;
  TaskModel.findOneAndDelete({ owner: user._id, _id })
    .then((response) => {
      res.status(200).json({ success: true, message: 'Объект удален', _id });
    })
    .catch((err) => {
      res.status(400).json({ error: true, message: 'Ошибка удаления объекта' });
    });
});

taskRouter.patch('/addStepToTask/:id/:shared?', async (req, res) => {
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
    const task = await TaskModel.findOne({ _id: taskId });
    if (task && task.members.includes(user._id)) {
      addStep(title, taskId, user._id);
    } else {
      res.status(400).json({ error: true, message: 'Ошибка добавления шага' });
    }
  } else {
    addStep(title, taskId, user._id);
  }
});

taskRouter.patch('/changeTask/:taskId', async (req, res) => {
  TaskModel.changeTask(req, res);
});

export default taskRouter;
