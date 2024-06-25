import { Types } from 'mongoose';
import {
  ChangeTaskDTO,
  AdditionalDataReturnedType,
  taskSchema,
  AnotherTaskFieldsThatCanBeChanged,
  YourselfTaskFieldsThatCanBeChanged,
} from '../../db/schemas/taskSchema.js';
import { resError } from '../../db/utils/index.js';
import { getUser } from '../../utils/index.js';
import { Request, Response } from 'express';

taskSchema.statics.changeTask = async function (req: Request, res: Response) {
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
    const task = await this.findOne({ _id: taskId });
    if (!task) {
      resError(res, 400, 'Таска не существует');
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
      resError(res, 400, 'Ошибка выполнения запроса');
      return;
    }

    const newTask = await task.save();
    additionalData.message = 'Данные изменены';
    additionalData.field = changeFields;

    res.status(201).json({
      success: true,
      task: newTask,
      ...additionalData,
    });
  } catch (error) {
    resError(res, 500, 'Ошибка выполнения запроса');
  }
};
