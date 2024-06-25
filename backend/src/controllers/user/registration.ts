import { Request, Response } from 'express';
import { userSchema } from '../../db/schemas/userSchema.js';
import { cryptographer } from '../../db/utils/index.js';

userSchema.statics.changeUserData = async function (
  req: Request,
  res: Response
) {
  const hashedPassword = cryptographer.getHashedWithSecret(req.body.password);

  this.create({ ...req.body, password: hashedPassword })
    .then((response) => {
      res.status(202).json({
        error: false,
        message: 'Регистрация прошла успешно',
      });
    })
    .catch(({ errorResponse }) => {
      if (errorResponse.code === 11000) {
        res
          .status(400)
          .json({ error: true, message: 'Такой пользователь уже существует' });
      }
    });
};
