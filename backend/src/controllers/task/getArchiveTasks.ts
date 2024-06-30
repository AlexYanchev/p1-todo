import { Request, Response } from 'express';
import { getUser } from '../../utils/index.js';
import { TaskModel } from '../../db/schemas/taskSchema.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';

const getArchiveTasks = async function (req: Request, res: Response) {
  console.log('Запрос на получение архивных тасков');
  const user = getUser(req);
  console.log('Логин юзера: ', user.login);

  const currentDate = new Date();

  console.log('Сначала удаляем таски которые вышли за пределы срока хранения');

  try {
    const deletedTask = await TaskModel.deleteMany({
      owner: user._id,
      willBeDeleted: { $lte: currentDate },
    });

    if (deletedTask) {
      console.log(
        'Окончательно удалили таски, которые вышли за пределы срока. Результат: ',
        deletedTask
      );
    } else {
      console.log(
        'Не нашли тасков, которые нужно удалить. Результат: ',
        deletedTask,
        'Продолжаем запрос'
      );
    }
  } catch (e) {
    console.log(
      'Ошибка удаления тасков, которые вышли за пределы срока. Ошибка: ',
      e
    );
    resError(res, responseErrorData.default);
  }

  console.log(
    'Ищем архивные таски которые помечены на удаление, завершены или просрочены.'
  );

  TaskModel.find(
    {
      owner: user._id,
      $or: [
        { willBeDeleted: { $ne: null } },
        { complete: true },
        { expired: true },
      ],
    },
    { willBeDeleted: 1, complete: 1, expired: 1, owner: 1, title: 1 }
  )
    .then((tasks) => {
      console.log('Успешно нашли таски. Возвращаем объект: ', tasks);
      resSuccess(res, responseSuccessData.default, tasks);
    })
    .catch((error) => {
      console.log(
        'Произошла ошибка при поиске архивных тасков. Ошибка: ',
        error
      );
      resError(res, responseErrorData.default);
    });
};

export default getArchiveTasks;
