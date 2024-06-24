import mongoose, { Schema, Types, Model, Document } from 'mongoose';
import { createHmac } from 'crypto';
import * as dotenv from 'dotenv';
import { checkerBody, cryptographer, tokenizer } from '../utils/index.js';
import { Request, Response } from 'express';
import { getUser } from '../../utils/index.js';
import { resError } from '../utils/index.js';

dotenv.config();

export type UserType = {
  _id: Types.ObjectId;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
};

export type ChangeUserDataParamsType = {
  userId: Types.ObjectId;
  changedFields: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
};

export type UserWithoutPasswordType = Omit<UserType, 'password'>;

export interface UserModelWithStatic extends Model<UserType> {
  changeUserData: (req: Request, res: Response) => void;
  registrationUser: (user: UserType) => Promise<UserType & Document>;
  login: (req: Request, res: Response) => Promise<void>;
}

const onlyRusLettersReg = /^[а-яА-ЯёЁ]+$/;

const userSchema = new mongoose.Schema<UserType, UserModelWithStatic>(
  {
    login: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 15,
      match: /^[A-Za-z0-9]+$/,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 15,
      match: onlyRusLettersReg,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
      match: onlyRusLettersReg,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
      maxlength: 310,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.statics.changeUserData = async function (
  req: Request,
  res: Response
) {
  type FieldsForChanges = 'avatar' | 'firstName' | 'lastName';
  type FieldsForChangesBodyDTO = { [field in FieldsForChanges]: string };

  const user = getUser(req);

  if (
    !checkerBody.includesKeyAndValueType(
      ['avatar', 'firstName', 'lastName'],
      req.body.fields,
      'string'
    )
  ) {
    resError(res, 400, 'Некорректный запрос');
    return;
  }

  const fields = req.body.fields as FieldsForChangesBodyDTO;

  UserModel.findOneAndUpdate({ userId: user._id }, fields)
    .then((user) => {
      res.status(200).json({
        success: true,
        message: 'Успешно',
        fields,
      });
    })
    .catch((error) => {
      resError(res, 400, 'Ошибка обновления данных');
    });
};

userSchema.statics.registrationUser = async function (user: UserType) {
  const hashedPassword = cryptographer.getHashedWithSecret(user.password);

  return await this.create({ ...user, password: hashedPassword });
};

userSchema.statics.login = async function (
  req: Request,
  res: Response
): Promise<void> {
  if (
    !checkerBody.includesKeyAndValueType(
      ['login', 'password'],
      req.body.fields,
      'string'
    )
  ) {
    resError(res, 400, 'Некорректный запрос');
    return;
  }

  const user = await this.findOne({
    login: req.body.login,
    password: cryptographer.getHashedWithSecret(req.body.password),
  });

  if (!user) {
    resError(res, 400, 'Неправильный логин или пароль');
    return;
  }
  const returnedUser = user.toObject({ flattenObjectIds: true });

  tokenizer
    .getTokenAndData<UserWithoutPasswordType>(returnedUser)
    .then((tokenAndData) => {
      res.status(202).json(tokenAndData);
      return;
    })
    .catch((error) => {
      resError(res, 401, error.message);
      return;
    });
};

export const UserModel = mongoose.model<UserType, UserModelWithStatic>(
  'User',
  userSchema,
  'User'
);
