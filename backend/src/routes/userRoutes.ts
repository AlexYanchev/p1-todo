import { Router } from 'express';
import { validateToken } from '../utils/index.js';
import changeUserData from '../controllers/user/changeUserData.js';
import login from '../controllers/user/login.js';
import registrationUser from '../controllers/user/registration.js';
import { resError, responseErrorData } from '../helpers/response/resError.js';
import searchPeople from '../controllers/user/searchPeople.js';
import { changeFriendsList } from '../controllers/user/changeFriendsList.js';
import { getFriendsList } from '../controllers/user/getFriendsList.js';
import shareTask from '../controllers/user/shareTask.js';
import proposeStep from '../controllers/user/proposeStep.js';
import { getOffers } from '../controllers/user/getOffers.js';
import { changeOfferTask } from '../controllers/user/changeOfferTask.js';
import { changeOfferStep } from '../controllers/user/changeOfferStep.js';

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

userRouter.get('/getData/offers/:type?', async (req, res) => {
  console.log('Запрос предложений для пользователя');
  try {
    await getOffers(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

userRouter.put('/share/friend/:idFriend/:idTask', async (req, res) => {
  console.log('Делимся задачей с другом');
  try {
    await shareTask(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

userRouter.patch('/share/proposeStep/:idTask', async (req, res) => {
  console.log('Предлагаем шаг');
  try {
    await proposeStep(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

userRouter.patch('/changeOfferTask/:idTask/:action', async (req, res) => {
  console.log('Изменяем предложенный таск');
  try {
    await changeOfferTask(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

userRouter.patch('/changeOfferStep/:idStep/:action', async (req, res) => {
  console.log('Изменяем предложенный шаг');
  try {
    await changeOfferStep(req, res);
  } catch (e) {
    console.log('Общая ошибка. Что то пошло не так. ', e);
    resError(res, responseErrorData.default);
  }
});

export default userRouter;
