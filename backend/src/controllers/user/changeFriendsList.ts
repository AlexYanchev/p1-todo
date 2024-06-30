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

export const changeFriendsList = async (req: Request, res: Response) => {
  const user = getUser(req);

  const idFriend = req.params.idFriend as string;
  console.log('Запрос на изменение списка друзей. ID друга: ', idFriend);
  console.log('Ищем текущего юзера и друга для добавления');
  const result = await UserModel.find({ _id: [user._id, idFriend] });

  console.log('Результат поиска. Результат: ', result);

  const isFriends =
    result[0].friends.includes(result[1]._id) &&
    result[1].friends.includes(result[0]._id);

  if (!isFriends) {
    console.log('Пользователей нет в друзьях у друг друга. Добавляем.');
    result[0].friends = result[0].friends.concat([result[1]._id]);
    result[1].friends = result[1].friends.concat([result[0]._id]);
  } else if (isFriends) {
    console.log(
      'Пользователи уже есть в друзьях друг у друга. Удаляем из друзей. '
    );
    result[0].friends = result[0].friends.filter(
      (idFriend) => !idFriend.equals(result[1]._id)
    );
    result[1].friends = result[1].friends.filter(
      (idFriend) => !idFriend.equals(result[0]._id)
    );
  } else {
    console.log('Ошибка изменения списка друзей. Отправляем ошибку. ');
    resError(res, responseErrorData.badRequest);
    return;
  }

  try {
    const user1 = await result[0].save();
    const user2 = await result[1].save();

    console.log(
      'Сохранили результат. Друзья юзера1: ',
      user1.friends,
      'Друзья юзера2: ',
      user2.friends
    );
    resSuccess(res, responseSuccessData.default, { idFriend });
  } catch (e) {
    console.log('Ошибка сохранения результатов. Ошибка: ', e);
    resError(res, responseErrorData.default);
  }
};
