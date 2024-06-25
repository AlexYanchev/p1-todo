import { Router } from 'express';
import { UserModel } from '../db/schemas/userSchema.js';
import { validateToken } from '../utils/index.js';

const userRouter = Router();

userRouter.post('/login', (req, res) => {
  UserModel.login(req, res);
});

userRouter.post('/registration', (req, res) => {
  UserModel.registrationUser(req, res);
});

userRouter.use(validateToken);

userRouter.patch('/changeUserData', (req, res) => {
  UserModel.changeUserData(req, res);
});

export default userRouter;
