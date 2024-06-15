import mongoose, { Schema, Types } from 'mongoose';

export type StepType = {
  // id: string;
  owner: Types.ObjectId;
  title: string;
  taskId: Types.ObjectId;
  complete: boolean;
};

const stepSchema = new mongoose.Schema<StepType>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[A-Za-zа-яА-ЯёЁ0-9]+$/,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Task',
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

export const StepModel = mongoose.model('Step', stepSchema, 'Step');
