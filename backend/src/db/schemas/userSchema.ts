import mongoose, { Schema, Types, Model, Document } from 'mongoose';
import { createHmac } from 'crypto';
import * as dotenv from 'dotenv';
import { cryptographer, tokenizer } from '../utils/index.js';

dotenv.config();

export type UserType = {
  _id: Types.ObjectId;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
  //   taskList: Array<Types.ObjectId>;
};

export interface UserModelWithStatic extends Model<UserType> {
  registrationUser: (user: UserType) => Promise<UserType & Document>;
  login: (data: { login: string; password: string }) => Promise<
    UserType &
      Required<{
        _id: Types.ObjectId;
      }> & { token: string }
  >;
}

const onlyRusLettersReg = /^[а-яА-ЯёЁ0-9]+$/;

const userSchema = new mongoose.Schema<UserType, UserModelWithStatic>({
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
  },
});

userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.statics.registrationUser = async function (user: UserType) {
  const hashedPassword = cryptographer.getHashedWithSecret(user.password);

  return await this.create({ ...user, password: hashedPassword });
};

userSchema.statics.login = async function (data: {
  login: string;
  password: string;
}): Promise<any> {
  const user = await this.findOne(
    {
      login: data.login,
      password: cryptographer.getHashedWithSecret(data.password),
    },
    '-_id'
  );

  return new Promise((resolve, reject) => {
    if (!user) {
      return reject(new Error('Неправильный логин или пароль'));
    }
    const returnedUser = user.toObject({ flattenObjectIds: true });
    return tokenizer
      .getTokenAndData(returnedUser)
      .then((tokenAndData) => {
        return resolve(tokenAndData);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

export const UserModel = mongoose.model<UserType, UserModelWithStatic>(
  'User',
  userSchema,
  'User'
);
