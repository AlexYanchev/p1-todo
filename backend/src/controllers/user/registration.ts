import { Request, Response } from 'express';
import { UserModel } from '../../db/schemas/userSchema.js';
import { cryptographer } from '../../db/utils/index.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';
import { checkerBody } from '../../db/utils/index.js';

export default async function registrationUser(req: Request, res: Response) {
  if (
    !checkerBody.includesKeyAndValueType(
      ['login', 'password', 'firstName', 'lastName'],
      req.body,
      'string'
    )
  ) {
    resError(res, responseErrorData.badRequest);
    return;
  }

  const hashedPassword = cryptographer.getHashedWithSecret(req.body.password);

  UserModel.create({ ...req.body, password: hashedPassword })
    .then((response) => {
      resSuccess(res, responseSuccessData.registrationSuccess);
    })
    .catch(({ errorResponse }) => {
      if (errorResponse.code === 11000) {
        resError(res, responseErrorData.userIsExist);
      }
    });
}
