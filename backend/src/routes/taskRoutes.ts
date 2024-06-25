import { Router } from 'express';
import { TaskModel } from '../db/schemas/taskSchema.js';

const taskRouter = Router();

taskRouter.post('/createTask', (req, res) => {
  TaskModel.createTask(req, res);
});

taskRouter.get('/getTasks/:tasksType', (req, res) => {
  TaskModel.getTasks(req, res);
});

taskRouter.delete('/deleteTask/:id', (req, res) => {
  TaskModel.deleteTask(req, res);
});

taskRouter.patch('/addStepToTask/:id/:shared?', async (req, res) => {
  TaskModel.addStepToTask(req, res);
});

taskRouter.patch('/changeTask/:taskId', async (req, res) => {
  TaskModel.changeTask(req, res);
});

export default taskRouter;
