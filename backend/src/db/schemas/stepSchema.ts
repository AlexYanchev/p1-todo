import { Request, Response } from 'express';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type StepType = {
  // id: string;
  owner: Types.ObjectId;
  title: string;
  taskId: Types.ObjectId;
  complete?: boolean;
};

export interface StepTypeWithStatic extends Model<StepType> {
  addStep: (step: StepType) => Promise<StepType & Document>;
  deleteStep: (req: Request, res: Response) => Promise<void>;
  changeCompleteStatusStep: (req: Request, res: Response) => Promise<void>;
}

export const stepSchema = new mongoose.Schema<StepType, StepTypeWithStatic>({
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
    match: /^[A-Za-zа-яА-ЯёЁ0-9 -_]+$/,
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

stepSchema.statics.addStep = function (step: StepType) {
  return this.create(step);
};

export const StepModel = mongoose.model<StepType, StepTypeWithStatic>(
  'Step',
  stepSchema,
  'Step'
);
