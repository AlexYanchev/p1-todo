import { Request, Response } from 'express';
import { UserModel } from '../../db/schemas/userSchema.js';
import { checkerBody } from '../../db/utils/index.js';
import { getUser } from '../../utils/index.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';

type FieldsForJustCheck = 'login';
type FieldsForChanges = 'avatar' | 'firstName' | 'lastName' | 'login';
type FieldsForChangesBodyDTO = { [field in FieldsForChanges]: string };

export default async function changeUserData(req: Request, res: Response) {
  const user = getUser(req);
  const justCheck = req.params.justCheck === 'justCheck';
  console.log('Проверяем флаг justCheck: ', justCheck);

  if (
    !checkerBody.includesKeyAndValueType(
      ['avatar', 'firstName', 'lastName', 'login'],
      req.body.fields,
      'string'
    )
  ) {
    resError(res, responseErrorData.badRequest);
    return;
  }

  const fields = req.body.fields as FieldsForChangesBodyDTO;

  console.log('Чекер проверил body, ошибок не нашел. ', fields);

  if (justCheck) {
    if (fields.login && fields.login.length >= 3) {
      console.log(
        'Есть флаг justCheck: ',
        justCheck,
        'Поле login: ',
        fields.login
      );
      UserModel.findOne({ login: fields.login })
        .then((foundUser) => {
          if (foundUser) {
            console.log('Такой пользователь уже существует: ', foundUser);
            resSuccess(res, responseSuccessData.default, { canChange: false });
          } else {
            console.log('Пользователя нет, логин свободен');
            resSuccess(res, responseSuccessData.default, { canChange: true });
          }
        })
        .catch((error) => {
          console.log(
            'Что то пошло не так и база данных выдала ошибку. ',
            error.message
          );
          resError(res, responseErrorData.badRequest);
        });
    } else {
      console.log(
        'Не прошла проверка поля. Логин: ',
        fields.login,
        'Проверка на количество символов ',
        fields.login.length >= 3
      );
      resSuccess(res, responseSuccessData.default, {
        canChange: false,
      });
    }
  } else {
    UserModel.findOneAndUpdate({ userId: user._id }, fields)
      .then((user) => {
        resSuccess(res, responseSuccessData.updateDataSuccess, { fields });
      })
      .catch((error) => {
        resError(res, responseErrorData.errorUpdateData);
      });
  }
}
