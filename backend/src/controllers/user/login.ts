import { Request, Response } from 'express';
import {
  UserWithoutPasswordType,
  userSchema,
} from '../../db/schemas/userSchema.js';
import {
  checkerBody,
  cryptographer,
  resError,
  tokenizer,
} from '../../db/utils/index.js';

userSchema.statics.login = async function (
  req: Request,
  res: Response
): Promise<void> {
  if (
    !checkerBody.includesKeyAndValueType(
      ['login', 'password'],
      req.body.fields,
      'string'
    )
  ) {
    resError(res, 400, 'Некорректный запрос');
    return;
  }

  const user = await this.findOne({
    login: req.body.login,
    password: cryptographer.getHashedWithSecret(req.body.password),
  });

  if (!user) {
    resError(res, 400, 'Неправильный логин или пароль');
    return;
  }
  const returnedUser = user.toObject({ flattenObjectIds: true });

  tokenizer
    .getTokenAndData<UserWithoutPasswordType>(returnedUser)
    .then((tokenAndData) => {
      res.status(202).json(tokenAndData);
      return;
    })
    .catch((error) => {
      resError(res, 401, error.message);
      return;
    });
};
