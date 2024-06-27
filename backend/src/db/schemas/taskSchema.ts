import { Request, Response } from 'express';
import mongoose, { Model, Schema, Types } from 'mongoose';

export type TaskType = {
  title: string;
  complete: boolean;
  expiredAt: Schema.Types.Date;
  public: boolean;
  owner: Types.ObjectId;
  members: Array<Types.ObjectId>;
  likes: Array<Types.ObjectId>;
  expired: boolean;
  willBeDeleted: Schema.Types.Date | null;
};

export type TaskCreateType = Pick<
  TaskType,
  'title' | 'owner' | 'public' | 'expiredAt'
>;

export type AdditionalDataReturnedType = {
  message: string;
  field: string | null;
  action: boolean | null;
  userIdWhoInitiatedChanges: Types.ObjectId;
};

export type ChangeTaskDTO = 'public' | 'complete' | 'likes' | 'members';

export type YourselfTaskFieldsThatCanBeChanged = 'public' | 'complete';
export type AnotherTaskFieldsThatCanBeChanged = 'likes' | 'members';

export const taskSchema = new mongoose.Schema<TaskType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 15,
      match: /^[A-Za-zа-яА-ЯёЁ0-9 -_]+$/,
    },

    expiredAt: {
      type: Schema.Types.Date,
      required: true,
      trim: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    public: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },

    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    expired: {
      type: Boolean,
      default: false,
    },
    willBeDeleted: { type: Schema.Types.Date, default: null },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

taskSchema.virtual('steps', {
  ref: 'Step',
  localField: '_id',
  foreignField: 'taskId',
});

// taskSchema.pre('find', async function (next) {
//   const currentDate = new Date();
//   console.log(
//     'Работает pre хук find. Для фильтрации просроченных задач. Получили текущую дату: ',
//     currentDate
//   );
//   const query = this.getQuery();
//   query.$and = [{ expiredAt: { $lte: currentDate } }];
//   console.log(
//     'Фильтрации просроченных задач. Добавили в запрос дополнительный фильтр. Теперь запро такой: ',
//     query,
//     'Пытаемся обновить Таски.'
//   );
//   try {
//     const updatedTask = await this.updateMany(query, { expired: true });
//     if (updatedTask) {
//       console.log(
//         'Успешно отфильтровали и добавили поле expired=true: ',
//         updatedTask
//       );
//       next();
//     } else {
//       console.log('Обновленных тасков нет: ', updatedTask);
//     }
//   } catch (e: any) {
//     console.log('Ошибка обновления Тасков: ', e);
//     next(e);
//   }
// });

export const TaskModel = mongoose.model<TaskType>('Task', taskSchema, 'Task');
