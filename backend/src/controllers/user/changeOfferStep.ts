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
import { StepModel } from '../../db/schemas/stepSchema.js';

export const changeOfferStep = async (req: Request, res: Response) => {
  const user = getUser(req);
  const idStep = req.params.idStep;
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

    currentUser.sharedToMeSteps = currentUser.sharedToMeSteps.filter(
      (step) => !step._id.equals(idStep)
    );

    try {
      const saved = await currentUser.save();
      if (saved) {
        console.log(
          'Успешно удалили шаг и сохранили результат. Результат: ',
          currentUser.sharedToMeSteps
        );
        resSuccess(res, responseSuccessData.default, {
          idStep,
        });
      }
    } catch (err) {
      console.log('Ошибка выполнения запроса. ', err);
      resError(res, responseErrorData.default);
    }
  } else if (action === 'accept') {
    console.log('Action определен как accept.');
    console.log('Ищем предложенный шаг, что бы определить taskId.');
    const proposedStep = currentUser.sharedToMeSteps.find((step) =>
      step._id.equals(idStep)
    );
    if (!proposedStep) {
      console.log('Предложенный шаг не найден. Возвращаем ошибку');
      resError(res, responseErrorData.default);
      return;
    }
    const task = await TaskModel.findOne({ _id: proposedStep.task });
    if (!task) {
      console.log('Таск не найден. Ошибка.');
      resError(res, responseErrorData.badRequest);
      return;
    }
    console.log(
      'Поле sharedToMeSteps до операции удаления принятого шага: ',
      currentUser.sharedToMeSteps
    );
    currentUser.sharedToMeSteps = currentUser.sharedToMeSteps.filter(
      (step) => !step._id.equals(idStep)
    );

    console.log(
      'Поле sharedToMeSteps после удаления принятого шага: ',
      currentUser.sharedToMeSteps
    );

    try {
      const saved = await currentUser.save();
      if (saved) {
        console.log(
          'Успешно удалили шаг и сохранили результат. Результат: ',
          currentUser.sharedToMeSteps
        );
      }
    } catch (err) {
      console.log('Ошибка выполнения запроса. ', err);
    }

    const acceptedStep = await StepModel.create({
      _id: proposedStep._id,
      owner: proposedStep.proposedBy,
      title: proposedStep.title,
      taskId: proposedStep.task,
    });

    if (!acceptedStep) {
      console.log('Ошибка при создании принятого шага.');
      resError(res, responseErrorData.badRequest);
      return;
    } else {
      console.log(
        'Успешно обновили таск и сохранили принятый шаг. Принятый шаг: ',
        acceptedStep
      );
      resSuccess(res, responseSuccessData.default, {
        idStep: acceptedStep._id,
      });
    }
  } else {
    console.log('Ошибка. Ни один action не подходит. Action: ', action);
    resError(res, responseErrorData.default);
  }
};
