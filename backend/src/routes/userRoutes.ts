import { Router } from 'express';
import { validateToken } from '../utils/index.js';
import changeUserData from '../controllers/user/changeUserData.js';
import login from '../controllers/user/login.js';
import registrationUser from '../controllers/user/registration.js';
import { resError, responseErrorData } from '../helpers/response/resError.js';

const userRouter = Router();

userRouter.post('/login', async (req, res) => {
  try {
    await login(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

userRouter.post('/registration', async (req, res) => {
  try {
    await registrationUser(req, res);
  } catch {
    resError(res, responseErrorData.default);
  }
});

userRouter.use(validateToken);

userRouter.patch('/changeUserData/:justCheck?', async (req, res) => {
  try {
    await changeUserData(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

export default userRouter;
