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

export const getFriendsList = async (req: Request, res: Response) => {
  const user = getUser(req);

  console.log('Запрос на получения списка друзей. ');
  UserModel.findOne({ _id: user._id }, { friends: 1 })
    .populate({
      path: 'friends',
      select: ['_id', 'firstName', 'lastName', 'avatar', 'friends'],
    })
    .then((friendsList) => {
      console.log('нашли друзей. ', friendsList);
      resSuccess(res, responseSuccessData.default, {
        friendsList: friendsList?.friends,
      });
    })
    .catch((err) => {
      console.log('Ошибка выполнения запроса. ', err);
      resError(res, responseErrorData.default);
    });
};
