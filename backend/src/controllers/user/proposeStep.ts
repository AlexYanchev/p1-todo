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
import { checkerBody } from '../../db/utils/index.js';
import { Types } from 'mongoose';

export default async function proposeStep(req: Request, res: Response) {
  const user = getUser(req);
  const idTask = req.params.idTask;
  const step: { title: string } = req.body.step;
  if (!checkerBody.includesKeyAndValueType(['title'], step, 'string')) {
    console.log('Параметры переданы неправильно. Body: ', step);
    resError(res, responseErrorData.badRequest);
    return;
  }

  if (!idTask) {
    console.log('Параметры idTask не передан. Возвращаем ошибку.');
    resError(res, responseErrorData.badRequest);
  }

  const task = await TaskModel.findOne(
    { _id: idTask },
    { owner: 1, members: 1 }
  );

  if (!task || !task.members.includes(user._id)) {
    console.log(
      'Такого таска нет или вы не являетесь участником. Возвращаем ошибку'
    );
    resError(res, responseErrorData.notExist);
    return;
  }

  const ownerTask = await UserModel.findOne({ _id: task.owner });

  if (!ownerTask) {
    console.log(
      'Владелец задачи, в которую нужно добавить шаг, не найден. Возвращаем ошибку'
    );
    resError(res, responseErrorData.notExist);
    return;
  }

  ownerTask.sharedToMeSteps = ownerTask.sharedToMeSteps.concat([
    {
      title: step.title,
      task: task._id,
      proposedBy: user._id,
      _id: new Types.ObjectId(),
    },
  ]);

  console.log(
    'Предложили шаг пользователю, к которому мы присоединились. Предложенные шаги: ',
    ownerTask.sharedToMeSteps
  );

  ownerTask
    .save()
    .then((result) => {
      console.log('Успешно сохранили данные.');
      resSuccess(res, responseSuccessData.addDataSuccess);
    })
    .catch((err) => {
      console.log('Ошибка при сохранении результата');
      resError(res, responseErrorData.default, err);
    });
}
