import mongoose, { Schema, Types } from 'mongoose';

export type TaskType = {
  // id: string;
  title: string;
  date: string;
  complete: boolean;
  expiredAt: string;
  public: boolean;
  owner: Types.ObjectId;
  members: Array<Types.ObjectId>;
  //   steps: Array<Types.ObjectId>;
  likes: Array<Types.ObjectId>;
};

const taskSchema = new mongoose.Schema<TaskType>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
    match: /^[A-Za-zа-яА-ЯёЁ0-9]+$/,
  },
  date: {
    type: String,
    required: true,
    trim: true,
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
  },
  //   steps: {
  //     type: [Schema.Types.ObjectId],
  //     default: [],
  //   },
  likes: {
    type: [Schema.Types.ObjectId],
    // default: [],
  },
});

taskSchema.virtual('steps', {
  ref: 'Step',
  localField: '_id',
  foreignField: 'taskId',
});

export const TaskModel = mongoose.model('Task', taskSchema, 'Task');
