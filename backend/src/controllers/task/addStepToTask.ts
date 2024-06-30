import { Types } from 'mongoose';
import { StepModel } from '../../db/schemas/stepSchema.js';
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

export default async function addStepToTask(req: Request, res: Response) {
  const user = getUser(req);
  const taskId = new Types.ObjectId(req.params.id);
  const title = req.body.title as string;

  console.log(
    'Первичные данные. ',
    'user: ',
    user,
    'taskId: ',
    taskId,

    'title: ',
    title
  );

  const addStep = (
    title: string,
    taskId: Types.ObjectId,
    owner: Types.ObjectId
  ) => {
    console.log(
      'Пытаемся добавить шаг. ',
      'Title: ',
      title,
      'taskId: ',
      taskId,
      'owner: ',
      owner
    );
    StepModel.addStep({ title, taskId, owner })
      .then((step) => {
        console.log('Шаг добавлен');
        resSuccess(res, responseSuccessData.addDataSuccess, { step });
      })
      .catch((err: any) => {
        console.log('Шаг не добавлен', err);
        resError(res, responseErrorData.errorAddData);
      });
  };

  const task = await TaskModel.findOne({ _id: taskId });
  if (!task) {
    return resError(res, responseErrorData.notExist);
  }

  if (task.owner.equals(user._id)) {
    console.log('Таск own. Попробуем добавить шаг');
    addStep(title, taskId, user._id);
  } else if (task.members.includes(user._id)) {
    console.log('Таск shared. Попробуем добавить шаг');
    addStep(title, taskId, user._id);
  } else {
    console.log('Таск не найден, либо тебя нет в списках members');
    resError(res, responseErrorData.errorAddData);
  }
}
