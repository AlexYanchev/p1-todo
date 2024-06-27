import { NextFunction, Response, Request } from 'express';
import { UserType } from '../db/schemas/userSchema.js';
import { tokenizer } from '../db/utils/index.js';
import { Types } from 'mongoose';

export const getUser = (req: Request) => {
  return req.body.userDecoded as UserType;
};

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path.startsWith('/store')) {
    return next();
  }
  console.log(
    'Валидация токена. Поступил запрос с токеном: ',
    req.headers.authorization?.slice(0, 10) + '...'
  );
  const token = req.headers.authorization || '';
  console.log('Валидация токена. Токен: ', token.slice(0, 5) + '...');
  tokenizer
    .verifyToken(token)
    .then((decoded) => {
      console.log('Валидация токена. Юзер найден и декодирован: ', decoded._id);
      req.body.userDecoded = decoded;
      next();
    })
    .catch((error) => {
      console.log('Валидация токена. Ошибка верификации токена: ', error);
      next(error);
    });
};
