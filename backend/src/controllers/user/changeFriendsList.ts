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

  const result = await UserModel.find({ _id: [user._id, idFriend] }).populate({
    path: 'friends',
    select: ['_id', 'avatar', 'friends', 'firstName', 'lastName'],
  });
  const currentUser = result.find((u) => u._id.equals(user._id));
  const friend = result.find((u) => u._id.equals(idFriend));
  if (!currentUser || !friend) {
    console.log(
      'Не смогли найти друга или пользователя в результатирующей выборки из БД. Ошибка.'
    );
    resError(res, responseErrorData.default);
    return;
  }

  console.log('Результат поиска. Результат: ', result);

  const isFriends =
    currentUser.friends.includes(friend._id) &&
    friend.friends.includes(currentUser._id);

  if (!isFriends) {
    console.log('Пользователей нет в друзьях у друг друга. Добавляем.');
    currentUser.friends = currentUser.friends.concat([friend._id]);
    friend.friends = friend.friends.concat([currentUser._id]);
  } else if (isFriends) {
    console.log(
      'Пользователи уже есть в друзьях друг у друга. Удаляем из друзей. '
    );
    currentUser.friends = currentUser.friends.filter(
      (idFriend) => !idFriend.equals(friend._id)
    );
    friend.friends = friend.friends.filter(
      (idFriend) => !idFriend.equals(currentUser._id)
    );
  } else {
    console.log('Ошибка изменения списка друзей. Отправляем ошибку. ');
    resError(res, responseErrorData.badRequest);
    return;
  }

  try {
    const savedCurrentUser = await currentUser.save();
    const savedFriend = await friend.save();

    console.log(
      'Сохранили результат. Друзья юзера1: ',
      savedCurrentUser.friends,
      'Друзья юзера2: ',
      savedFriend.friends
    );
    resSuccess(res, responseSuccessData.default, {
      friendsList: currentUser.friends,
    });
  } catch (e) {
    console.log('Ошибка сохранения результатов. Ошибка: ', e);
    resError(res, responseErrorData.default);
  }
};
