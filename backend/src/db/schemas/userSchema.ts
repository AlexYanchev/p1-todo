import mongoose, { Schema, Types, Model, Document } from 'mongoose';
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
  registrationUser: (req: Request, res: Response) => void;
  login: (req: Request, res: Response) => Promise<void>;
}

const onlyRusLettersReg = /^[а-яА-ЯёЁ]+$/;

export const userSchema = new mongoose.Schema<UserType, UserModelWithStatic>(
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

export const UserModel = mongoose.model<UserType, UserModelWithStatic>(
  'User',
  userSchema,
  'User'
);
