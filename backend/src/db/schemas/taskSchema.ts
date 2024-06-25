import { Request, Response } from 'express';
import mongoose, { Model, Schema, Types } from 'mongoose';

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
  createTask: (req: Request, res: Response) => void;
  changeTask: (req: Request, res: Response) => void;
  getTasks: (req: Request, res: Response) => void;
  deleteTask: (req: Request, res: Response) => void;
  addStepToTask: (req: Request, res: Response) => void;
}

export const taskSchema = new mongoose.Schema<TaskType, TaskWithStaticType>(
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

export const TaskModel = mongoose.model<TaskType, TaskWithStaticType>(
  'Task',
  taskSchema,
  'Task'
);
