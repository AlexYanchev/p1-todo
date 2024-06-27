import { TaskModel } from '../../db/schemas/taskSchema.js';
import { getUser } from '../../utils/index.js';
import { Request, Response } from 'express';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';

export default async function createTask(req: Request, res: Response) {
  const user = getUser(req);
  console.log('Запрос на создания нового Таска. Body запроса: ', req.body);
  const task = await TaskModel.create({ ...req.body, owner: user._id });
  if (!task) {
    console.log('Таск не создан ', task);
    resError(res, responseErrorData.errorCreateData);

    return;
  }

  console.log('Таск создан ', task);
  task
    .populate('steps')
    .then((task) => {
      console.log('Отправляем успешный ответ о создании таска. Таск ', task);
      resSuccess(res, responseSuccessData.createDataSuccess, task);
    })
    .catch((err) => {
      console.log(
        'Ошибка в БД. Не смогли использовать метод populate таска. Ошибка: ',
        err.message
      );
      resError(res, responseErrorData.default);
    });
}
