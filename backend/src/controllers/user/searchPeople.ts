import { Request, Response } from 'express';
import { getUser } from '../../utils/index.js';
import { checkerQuery } from '../../db/utils/index.js';
import {
  resError,
  responseErrorData,
} from '../../helpers/response/resError.js';
import { UserModel } from '../../db/schemas/userSchema.js';
import {
  resSuccess,
  responseSuccessData,
} from '../../helpers/response/resSuccess.js';

const searchPeople = async (req: Request, res: Response) => {
  console.log('Поиск людей. Ищем текущего пользователя.');
  const user = getUser(req);
  console.log('Пользователь: ', user);
  const query = req.query as Record<'value', string>;
  console.log('Запрос поиска: ', query, 'Запускаем Чекер Запросов.');
  if (!checkerQuery(query, ['value'])) {
    console.log(
      'Чекер Запроса запретил выполнение. Отправляем ответ с ошибкой.'
    );
    resError(res, responseErrorData.badRequest);
  }

  console.log('Пробуем найти людей по таким ключевым словам: ', query.value);

  UserModel.find({ $text: { $search: query.value, $language: 'russian' } })
    .then((result) => {
      console.log(
        'Запрос успешно обработан. Нашли таких людей: ',
        result.map((user) => user.login),
        'Отправляем ответ.'
      );
      resSuccess(res, responseSuccessData.default, result);
    })
    .catch((err) => {
      console.log(
        'Ошибка выполнения запроса. Ошибка: ',
        err,
        'Отправляем ответ.'
      );
      resError(res, responseErrorData.default);
    });
};

export default searchPeople;
