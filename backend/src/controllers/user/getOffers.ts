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

export const getOffers = async (req: Request, res: Response) => {
  const user = getUser(req);
  const type = req.params.type as 'steps' | 'tasks';
  if (type && !checkerParams({ [req.params.type]: ['steps', 'tasks'] })) {
    console.log(
      'Передан некорректный тип. Полученные параметры: ',
      req.params.type,
      ' Отправляем ошибку'
    );
    resError(res, responseErrorData.badRequest);
  }

  const projections = {
    all: { sharedToMeTasks: 1, sharedToMeSteps: 1 },
    tasks: { sharedToMeTasks: 1 },
    steps: { sharedToMeSteps: 1 },
  };

  let currentProjection;

  switch (type) {
    case 'steps': {
      currentProjection = projections.steps;
      break;
    }
    case 'tasks': {
      currentProjection = projections.tasks;
      break;
    }
    default: {
      currentProjection = projections.all;
    }
  }

  UserModel.findOne({ _id: user._id }, currentProjection)
    .populate([
      {
        path: 'sharedToMeTasks',
        select: [
          'title',
          'steps',
          '_id',
          'members',
          'public',
          'expiredAt',
          'likes',
        ],
      },
      {
        path: 'sharedToMeSteps.task',
        select: ['title', '_id'],
      },
      {
        path: 'sharedToMeSteps.proposedBy',
        select: ['_id', 'firstName', 'lastName', 'login'],
      },
    ])
    .then((result) => {
      if (result) {
        console.log(
          'Запрос успешно отработан. Высылаем количество Предложений. ',
          result
        );

        let responseObject;
        switch (type) {
          case 'tasks': {
            responseObject = { sharedToMeTasks: result.sharedToMeTasks };
            break;
          }
          case 'steps': {
            responseObject = { sharedToMeSteps: result.sharedToMeSteps };
            break;
          }
          default: {
            responseObject = {
              sharedToMeTasks: result.sharedToMeTasks.length,
              sharedToMeSteps: result.sharedToMeSteps.length,
            };
          }
        }
        resSuccess(res, responseSuccessData.default, responseObject);
      } else {
        console.log('Не смогли найти нужного юзера. ', result);
        resError(res, responseErrorData.badRequest);
      }
    })
    .catch((err) => {
      console.log('Ошибка выполнения запроса. ', err);
      resError(res, responseErrorData.default);
    });
};
