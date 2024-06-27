import { Types } from 'mongoose';
import {
  ChangeTaskDTO,
  AdditionalDataReturnedType,
  TaskModel,
  AnotherTaskFieldsThatCanBeChanged,
  YourselfTaskFieldsThatCanBeChanged,
} from '../../db/schemas/taskSchema.js';
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

export default async function changeTask(req: Request, res: Response) {
  const user = getUser(req);
  const taskId = new Types.ObjectId(req.params.taskId);
  const changeFields: ChangeTaskDTO = req.body.fields;

  let additionalData: AdditionalDataReturnedType = {
    message: '',
    field: null,
    action: null,
    userIdWhoInitiatedChanges: user._id,
  };

  try {
    const task = await TaskModel.findOne({ _id: taskId });
    if (!task) {
      resError(res, responseErrorData.notExist);
      return;
    }

    if (Array.isArray(task[changeFields]) && !task.owner.equals(user._id)) {
      const changeFieldsForAnotherTask =
        changeFields as AnotherTaskFieldsThatCanBeChanged;

      if (task[changeFieldsForAnotherTask].includes(user._id)) {
        task[changeFieldsForAnotherTask] = task[
          changeFieldsForAnotherTask
        ].filter((userId) => !userId.equals(user._id));
        additionalData.action = false;
      } else {
        task[changeFieldsForAnotherTask] = task[
          changeFieldsForAnotherTask
        ].concat(user._id);
        additionalData.action = true;
      }
    } else if (
      typeof task[changeFields] === 'boolean' &&
      task.owner.equals(user._id)
    ) {
      const changeFieldsForSelfTask =
        changeFields as YourselfTaskFieldsThatCanBeChanged;
      task[changeFieldsForSelfTask] = !task[changeFieldsForSelfTask];
      additionalData.action = task[changeFieldsForSelfTask];
    } else {
      resError(res, responseErrorData.badRequest);
      return;
    }

    const newTask = await task.save();
    additionalData.message = 'Данные изменены';
    additionalData.field = changeFields;

    resSuccess(res, responseSuccessData.updateDataSuccess, {
      task: newTask,
      ...additionalData,
    });
  } catch (error) {
    resError(res, responseErrorData.default);
  }
}
