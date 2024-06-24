import { Request, Response } from 'express';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { getUser } from '../../utils/index.js';
import { resError } from '../utils/index.js';

export type TaskType = {
  title: string;
  complete: boolean;
  expiredAt: string;
  public: boolean;
  owner: Types.ObjectId;
  members: Array<Types.ObjectId>;
  likes: Array<Types.ObjectId>;
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

export interface TaskWithStaticType extends Model<TaskType> {
  createTask: (task: TaskCreateType) => Promise<TaskType & Document>;
  changeTask: (req: Request, res: Response) => void;
}

const taskSchema = new mongoose.Schema<TaskType, TaskWithStaticType>(
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
      type: String,
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

taskSchema.statics.createTask = async function (task: TaskCreateType) {
  return (await this.create(task)).populate('steps');
};

taskSchema.statics.changeTask = async function (req: Request, res: Response) {
  const user = getUser(req);
  const taskId = new Types.ObjectId(req.params.taskId);
  const changeFields: ChangeTaskDTO = req.body.fields;

  let additionalData: AdditionalDataReturnedType = {
    message: '',
    field: null,
    action: null,
    userIdWhoInitiatedChanges: user._id,
  };

  try {
    const task = await TaskModel.findOne({ _id: taskId });
    if (!task) {
      resError(res, 400, 'Таска не существует');
      return;
    }

    if (Array.isArray(task[changeFields]) && !task.owner.equals(user._id)) {
      const changeFieldsForAnotherTask =
        changeFields as AnotherTaskFieldsThatCanBeChanged;

      if (task[changeFieldsForAnotherTask].includes(user._id)) {
        task[changeFieldsForAnotherTask] = task[
          changeFieldsForAnotherTask
        ].filter((userId) => !userId.equals(user._id));
        additionalData.action = false;
      } else {
        task[changeFieldsForAnotherTask] = task[
          changeFieldsForAnotherTask
        ].concat(user._id);
        additionalData.action = true;
      }
    } else if (
      typeof task[changeFields] === 'boolean' &&
      task.owner.equals(user._id)
    ) {
      const changeFieldsForSelfTask =
        changeFields as YourselfTaskFieldsThatCanBeChanged;
      task[changeFieldsForSelfTask] = !task[changeFieldsForSelfTask];
      additionalData.action = task[changeFieldsForSelfTask];
    } else {
      resError(res, 400, 'Ошибка выполнения запроса');
      return;
    }

    const newTask = await task.save();
    additionalData.message = 'Данные изменены';
    additionalData.field = changeFields;

    res.status(201).json({
      success: true,
      task: newTask,
      ...additionalData,
    });
  } catch (error) {
    resError(res, 500, 'Ошибка выполнения запроса');
  }
};

export const TaskModel = mongoose.model<TaskType, TaskWithStaticType>(
  'Task',
  taskSchema,
  'Task'
);
