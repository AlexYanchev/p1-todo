import { Router } from 'express';
import { UserModel } from '../db/schemas/userSchema.js';
import { validateToken } from '../utils/index.js';

const userRouter = Router();

userRouter.post('/login', (req, res) => {
  UserModel.login(req, res);
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

userRouter.use(validateToken);

userRouter.patch('/changeUserData', (req, res) => {
  UserModel.changeUserData(req, res);
});

export default userRouter;
