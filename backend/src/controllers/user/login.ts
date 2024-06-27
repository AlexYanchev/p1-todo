import { Request, Response } from 'express';
import {
  UserWithoutPasswordType,
  UserModel,
} from '../../db/schemas/userSchema.js';
import { checkerBody, cryptographer, tokenizer } from '../../db/utils/index.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';

export default async function login(
  req: Request,
  res: Response
): Promise<void> {
  const body = req.body.fields as { login: string; password: string };
  if (
    !checkerBody.includesKeyAndValueType(['login', 'password'], body, 'string')
  ) {
    resError(res, responseErrorData.badRequest);
    return;
  }

  const user = await UserModel.findOne({
    login: body.login,
    password: cryptographer.getHashedWithSecret(body.password),
  });

  if (!user) {
    resError(res, responseErrorData.credentialsBad);
    return;
  }
  const returnedUser = user.toObject({ flattenObjectIds: true });

  tokenizer
    .getTokenAndData<UserWithoutPasswordType>(returnedUser)
    .then((tokenAndData) => {
      resSuccess(res, responseSuccessData.loginSuccess, { ...tokenAndData });
      return;
    })
    .catch((error: Error) => {
      resError(res, responseErrorData.TokenError);
      return;
    });
}
