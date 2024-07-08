import { Request, Response } from 'express';
import { getUser } from '../../utils/index.js';
import { UserModel } from '../../db/schemas/userSchema.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import { checkerParams } from '../../db/utils/index.js';
import { TaskModel } from '../../db/schemas/taskSchema.js';

export const changeOfferTask = async (req: Request, res: Response) => {
  const user = getUser(req);
  const idTask = req.params.idTask;
  const action = req.params.action as 'delete' | 'accept';

  if (!checkerParams({ [action]: ['delete', 'accept'] })) {
    console.log(
      'Передан некорректный тип. Полученные параметры: ',
      req.params.action,
      ' Отправляем ошибку'
    );
    resError(res, responseErrorData.badRequest);
  }

  const currentUser = await UserModel.findOne({ _id: user._id });

  if (!currentUser) {
    console.log('Пользователь, отправивший запрос, не найден. Ошибка.');
    resError(res, responseErrorData.badRequest);
    return;
  }

  if (action === 'delete') {
    console.log('Action определен как delete.');

    currentUser.sharedToMeTasks = currentUser.sharedToMeTasks.filter(
      (id) => !id.equals(idTask)
    );

    try {
      const saved = await currentUser.save();
      if (saved) {
        console.log(
          'Успешно удалили таск и сохранили результат. Результат: ',
          currentUser.sharedToMeTasks
        );
        resSuccess(res, responseSuccessData.default, {
          idTask,
        });
      }
    } catch (err) {
      console.log('Ошибка выполнения запроса. ', err);
      resError(res, responseErrorData.default);
    }
  } else if (action === 'accept') {
    console.log('Action определен как accept.');
    const task = await TaskModel.findOne({ _id: idTask });
    if (!task) {
      console.log('Таск не найден. Ошибка.');
      resError(res, responseErrorData.badRequest);
      return;
    }
    console.log(
      'Поле sharedToMeTasks до операции удаления принятого таска: ',
      currentUser.sharedToMeTasks
    );
    currentUser.sharedToMeTasks = currentUser.sharedToMeTasks.filter(
      (id) => !id.equals(idTask)
    );

    console.log(
      'Поле sharedToMeTasks после удаления принятого таска: ',
      currentUser.sharedToMeTasks
    );

    try {
      const saved = await currentUser.save();
      if (saved) {
        console.log(
          'Успешно удалили таск и сохранили результат. Результат: ',
          currentUser.sharedToMeTasks
        );
      }
    } catch (err) {
      console.log('Ошибка выполнения запроса. ', err);
    }

    if (!task.members.includes(currentUser._id)) {
      console.log('Пользователя нет в качестве участника задачи. Добавляем.');
      task.members = task.members.concat([currentUser._id]);
      task
        .save()
        .then((result) => {
          console.log(
            'Успешно обновили таск сохранили результат. Результат: ',
            result
          );
          resSuccess(res, responseSuccessData.default, {
            idTask,
          });
        })
        .catch((err) => {
          console.log(
            'Ошибка при сохранении пользователя в качестве участника таска.'
          );
          resError(res, responseErrorData.default);
        });
    } else {
      console.log(
        'Пользователя уже участвует в задаче. Повторно добавлять не требуется.'
      );
      resSuccess(res, responseSuccessData.default, {
        alreadyInvolved: true,
        idTask,
      });
    }
  } else {
    console.log('Ошибка. Ни один action не подходит. Action: ', action);
    resError(res, responseErrorData.default);
  }
};
