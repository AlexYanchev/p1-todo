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

export default async function deleteTask(req: Request, res: Response) {
  console.log('Пытаемся удалить таск. Получаем юзера');
  const user = getUser(req);

  console.log('Логин юзера: ', user.login);
  const _id = req.params.id;

  console.log('Id удаляемого таска: ', _id);

  const currentDate = new Date();
  console.log('Получили текущую дату: ', currentDate);

  currentDate.setDate(currentDate.getDate() + 7);
  console.log('Установили новую дату удаления: ', currentDate);

  TaskModel.findByIdAndUpdate(
    { owner: user._id, _id },
    { willBeDeleted: currentDate }
  )
    .then((response) => {
      console.log(
        'Пометили, что таск нужно удалить ',
        currentDate,
        ' отправляем ответ.'
      );
      resSuccess(res, responseSuccessData.deleteDataSuccess, { _id });
    })
    .catch((err) => {
      console.log('Ошибка при удалении таска. ', err);
      resError(res, responseErrorData.errorDeleteData);
    });

  // TaskModel.findOneAndDelete({ owner: user._id, _id })
  //   .then((response) => {
  //     console.log('Таск удален, отправляем ответ.');
  //     resSuccess(res, responseSuccessData.deleteDataSuccess, { _id });
  //   })
  //   .catch((err) => {
  //     console.log('Ошибка при удалении таска. ', err);
  //     resError(res, responseErrorData.errorDeleteData);
  //   });
}
