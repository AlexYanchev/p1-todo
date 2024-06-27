import mongoose, { Types } from 'mongoose';
import * as dotenv from 'dotenv';

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

export const UserModel = mongoose.model<UserType>('User', userSchema, 'User');
