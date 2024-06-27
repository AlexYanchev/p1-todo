import { Response } from 'express';

type ResponseErrorKeyType =
  | 'default'
  | 'TokenError'
  | 'credentialsBad'
  | 'badRequest'
  | 'userIsExist'
  | 'errorAddData'
  | 'errorUpdateData'
  | 'errorDeleteData'
  | 'errorCreateData'
  | 'notExist';

type ResponseErrorType = {
  [k in ResponseErrorKeyType]: { status: number; message: string };
};

export const responseErrorData: ResponseErrorType = {
  default: { status: 500, message: 'Что-то пошло не так' },
  TokenError: { status: 401, message: 'Ошибка получения токена' },
  credentialsBad: { status: 400, message: 'Неправильный логин или пароль' },
  badRequest: { status: 400, message: 'Некорректный запрос' },
  userIsExist: { status: 400, message: 'Такой пользователь уже существует' },
  errorAddData: { status: 400, message: 'Ошибка добавления объекта' },
  errorUpdateData: { status: 400, message: 'Ошибка обновления данных' },
  errorDeleteData: { status: 400, message: 'Ошибка удаления объекта' },
  errorCreateData: { status: 400, message: 'Ошибка создания объекта' },
  notExist: { status: 400, message: 'Объекта не существует' },
};

export const resError = (
  res: Response,
  { status, message }: ResponseErrorType[keyof ResponseErrorType],
  data?: Record<string, any>
): void => {
  console.log(
    'Возникла ошибка. Отправляем ответ с ошибкой и с данными: ',
    data
  );
  res.status(status).json({ error: true, message, data });
};
