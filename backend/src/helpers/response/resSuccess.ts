import { Response } from 'express';

type ResponseErrorKeyType =
  | 'default'
  | 'registrationSuccess'
  | 'loginSuccess'
  | 'updateDataSuccess'
  | 'createDataSuccess'
  | 'addDataSuccess'
  | 'deleteDataSuccess';

type ResponseSuccessType = {
  [k in ResponseErrorKeyType]: { status: number; message: string };
};

export const responseSuccessData: ResponseSuccessType = {
  default: { status: 200, message: 'Запрос успешно выполнен' },
  registrationSuccess: { status: 202, message: 'Регистрация прошла успешно' },
  loginSuccess: { status: 202, message: 'Вход выполнен' },
  updateDataSuccess: { status: 200, message: 'Данные обновлены' },
  createDataSuccess: { status: 201, message: 'Объект создан' },
  addDataSuccess: { status: 201, message: 'Объект добавлен' },
  deleteDataSuccess: { status: 200, message: 'Объект удален' },
};

export const resSuccess = (
  res: Response,
  { status, message }: ResponseSuccessType[keyof ResponseSuccessType],
  data?: Record<string, any>
): void => {
  console.log('Отправляем успешный ответ с такими данными: ', {
    success: true,
    message,
    data,
  });
  res.status(status).json({ success: true, message, data });
};
