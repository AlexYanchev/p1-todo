import { Router } from 'express';
import { validateToken } from '../utils/index.js';
import changeUserData from '../controllers/user/changeUserData.js';
import login from '../controllers/user/login.js';
import registrationUser from '../controllers/user/registration.js';
import { resError, responseErrorData } from '../helpers/response/resError.js';
import searchPeople from '../controllers/user/searchPeople.js';
import { changeFriendsList } from '../controllers/user/changeFriendsList.js';
import { getFriendsList } from '../controllers/user/getFriendsList.js';

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

userRouter.get('/searchPeople', async (req, res) => {
  try {
    await searchPeople(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

userRouter.patch('/changeFriendsList/:idFriend', async (req, res) => {
  console.log('Поступил запрос не добавление друга');
  try {
    await changeFriendsList(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

userRouter.get('/getData/friendsList', async (req, res) => {
  console.log('Запрос списка друзей');
  try {
    await getFriendsList(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

export default userRouter;
