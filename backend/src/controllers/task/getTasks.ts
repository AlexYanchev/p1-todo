import { TaskModel } from '../../db/schemas/taskSchema.js';
import { TasksType } from '../../types/tasksType.js';
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
import { checkerParams } from '../../db/utils/index.js';

export default async function getTasks(req: Request, res: Response) {
  const user = getUser(req);

  if (
    !checkerParams({
      deleted: req.params.deleted,
      [req.params.tasksType]: ['own', 'public', 'shared'],
    })
  ) {
    resError(res, responseErrorData.badRequest);
    return;
  }

  const tasksType = req.params.tasksType as TasksType;
  const deleted = req.params.deleted as 'deleted';

  const commonFindQuery = {
    willBeDeleted: null,
  };
  const findQuery: { [k in TasksType]: any } = {
    public: { public: true },
    own: { owner: user._id },
    shared: { members: user._id },
  };
  const currentDate = new Date();

  console.log('Проверяем флаг запроса удаленных тасков: ', deleted);

  if (deleted && tasksType === 'own') {
    console.log(
      'Флаг установлен как: ',
      deleted,
      ' Ищем таски, которые вышли за пределы срока восстановления и удаляем их.'
    );
    TaskModel.deleteMany({
      owner: user._id,
      willBeDeleted: { $lte: currentDate },
    })
      .then((result) => {
        console.log(
          'Окончательно удалили таски, которые вышли за пределы срока. Результат: ',
          result
        );
      })
      .catch((err) => {
        console.log(
          'Ошибка удаления тасков, которые вышли за пределы срока. Ошибка: ',
          err
        );
      });
    console.log(
      'Ищем таски котрые помечены на удаление, но еще в пределах срока.'
    );
    TaskModel.find({ owner: user._id, willBeDeleted: { $ne: null } })
      .then((tasks) => {
        console.log(
          'Запрос на поиск удаленных тасков завершен успешно. Результат: ',
          tasks
        );
        resSuccess(res, responseSuccessData.default, {
          tasks,
          tasksType: 'own',
        });
      })
      .catch((error) => {
        console.log(
          'Запрос на поиск удаленных тасков завершен с ошибкой. Ошибка: ',
          error
        );
        resError(res, responseErrorData.default);
      });

    return;
  }

  console.log(
    'Перед получением Тасков пробуем их обновить, что бы выявить просроченные.'
  );
  const updatedTask = await TaskModel.updateMany(
    {
      ...findQuery[tasksType],
      expiredAt: { $lte: currentDate },
      expired: false,
    },
    { expired: true }
  );

  console.log('Обновление завершено. Результат: ', updatedTask);

  TaskModel.find({ ...findQuery[tasksType], ...commonFindQuery })
    .sort({ _id: -1 })
    .populate('steps')
    .then((tasks) => {
      resSuccess(res, responseSuccessData.default, {
        tasks,
        tasksType,
      });
    })
    .catch((err) => {
      resError(res, responseErrorData.default);
    });
}
