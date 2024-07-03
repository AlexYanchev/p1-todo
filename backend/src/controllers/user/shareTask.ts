import { Request, Response } from 'express';
import { UserModel } from '../../db/schemas/userSchema.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';
import { getUser } from '../../utils/index.js';
import { TaskModel } from '../../db/schemas/taskSchema.js';

export default async function shareTask(req: Request, res: Response) {
  const user = getUser(req);
  const idFriend = req.params.idFriend;
  const idTask = req.params.idTask;
  if (!idFriend && !idTask) {
    console.log('Параметры idTask и idFriend не переданы. Возвращаем ошибку.');
    resError(res, responseErrorData.badRequest);
  }

  const task = await TaskModel.findOne({ _id: idTask });

  if (!task) {
    console.log('Задача, которой поделились, не найдена. Возвращаем ошибку');
    resError(res, responseErrorData.notExist);
    return;
  }

  const userAndFriend = await UserModel.find({ _id: [user._id, idFriend] });

  if (!userAndFriend || userAndFriend.length !== 2) {
    console.log('Друг или пользователь не найдены. Возвращаем ошибку');
    resError(res, responseErrorData.notExist);
    return;
  }

  const isFriends =
    userAndFriend[0].friends.includes(userAndFriend[1]._id) &&
    userAndFriend[1].friends.includes(userAndFriend[0]._id);

  if (!isFriends) {
    console.log('Пользователи не друзья. Возвращаем ошибку.');
    resError(res, responseErrorData.badRequest);
    return;
  }

  const friend = userAndFriend.find((user) => user._id.equals(idFriend));

  if (!friend) {
    console.log('Не смогли определить друга. Возвращаем ошибку');
    resError(res, responseErrorData.default);
    return;
  }

  if (!friend.sharedToMeTasks.includes(task._id)) {
    console.log('Такой задачи еще нет у друга. Добавляем');
    friend.sharedToMeTasks = friend.sharedToMeTasks.concat([task._id]);
  } else {
    console.log('Такая задача уже есть у друга. Не добавляем');
    resError(res, responseErrorData.badRequest);
    return;
  }

  console.log(
    'Добавили задачу другу. Список расшаренных задач друга: ',
    friend.sharedToMeTasks
  );

  friend
    .save()
    .then((result) => {
      console.log('Успешно сохранили результат. Отправляем ответ');
      resSuccess(res, responseSuccessData.default);
    })
    .catch((err) => {
      console.log('Проблема при сохранении результата. Отправляем ответ');
      resError(res, responseErrorData.default);
    });
}
