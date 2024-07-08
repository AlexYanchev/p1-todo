import mongoose, { Schema, Types } from 'mongoose';
import * as dotenv from 'dotenv';
import login from '../../controllers/user/login.js';

dotenv.config();

export type UserType = {
  _id: Types.ObjectId;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
  friends: Types.ObjectId[];
  sharedToMeTasks: Types.ObjectId[];
  sharedToMeSteps: Array<{
    _id: Types.ObjectId;
    title: string;
    proposedBy: Types.ObjectId;
    task: Types.ObjectId;
  }>;
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

// export interface UserModelWithStatic extends Model<UserType> {
//   changeUserData: (req: Request, res: Response) => void;
//   registrationUser: (req: Request, res: Response) => void;
//   login: (req: Request, res: Response) => Promise<void>;
// }

const onlyRusLettersReg = /^[а-яА-ЯёЁ]+$/;

export const userSchema = new mongoose.Schema<UserType>(
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
    friends: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },
    sharedToMeTasks: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'Task',
    },
    sharedToMeSteps: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId },
          title: { type: String, require: true, trim: true },
          proposedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          task: { type: Schema.Types.ObjectId, ref: 'Task' },
        },
      ],
      default: [],
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

userSchema.pre('save', function (next) {
  this.firstName =
    this.firstName.charAt(0).toUpperCase() +
    this.firstName.slice(1).toLocaleLowerCase();

  this.lastName =
    this.lastName.charAt(0).toUpperCase() +
    this.lastName.slice(1).toLocaleLowerCase();
  next();
});

userSchema.index(
  { firstName: 'text', lastName: 'text' },
  { default_language: 'russian' }
);

export const UserModel = mongoose.model<UserType>('User', userSchema, 'User');

UserModel.init()
  .then((result) => {
    console.log('Индексы построены.');
  })
  .catch((err) => {
    console.log('Ошибка построения индексов. Ошибка: ', err);
  });
