import { Router } from 'express';
import addStepToTask from '../controllers/task/addStepToTask.js';
import changeTask from '../controllers/task/changeTask.js';
import createTask from '../controllers/task/createTask.js';
import deleteTask from '../controllers/task/deleteTask.js';
import getTasks from '../controllers/task/getTasks.js';
import { resError, responseErrorData } from '../helpers/response/resError.js';

const taskRouter = Router();

taskRouter.post('/createTask', async (req, res) => {
  try {
    await createTask(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

taskRouter.get('/getTasks/:tasksType/:deleted?', async (req, res) => {
  try {
    await getTasks(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

taskRouter.delete('/deleteTask/:id', async (req, res) => {
  try {
    await deleteTask(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

taskRouter.patch('/addStepToTask/:id', async (req, res) => {
  try {
    await addStepToTask(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

taskRouter.patch('/changeTask/:taskId', async (req, res) => {
  try {
    await changeTask(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

export default taskRouter;
