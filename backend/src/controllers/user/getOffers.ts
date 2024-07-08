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

  UserModel.findOne(
    { _id: user._id },
    { sharedToMeTasks: 1, sharedToMeSteps: 1 }
  )
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

        resSuccess(res, responseSuccessData.default, {
          sharedToMeTasks: result.sharedToMeTasks,
          sharedToMeSteps: result.sharedToMeSteps,
        });
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
