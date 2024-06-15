import { Router } from 'express';
import { UserModel } from '../db/schemas/userSchema.js';

const userRouter = Router();

userRouter.post('/login', (req, res) => {
  UserModel.login(req.body)
    .then((response) => {
      res.status(202).json(response);
    })
    .catch((err: Error) =>
      res.status(401).json({
        error: true,
        message: err.message,
      })
    );
});

userRouter.post('/registration', (req, res) => {
  UserModel.registrationUser(req.body)
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
});

export default userRouter;
