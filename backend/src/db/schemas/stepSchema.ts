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
  changeCompleteStatusStep: (
    taskId: Types.ObjectId,
    ownerId: Types.ObjectId
  ) => Promise<StepType & Document>;
}

const stepSchema = new mongoose.Schema<StepType, StepTypeWithStatic>({
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

stepSchema.statics.changeCompleteStatusStep = async function (
  stepId: Types.ObjectId,
  ownerId: Types.ObjectId
) {
  const step = await this.findOne({ _id: stepId, owner: ownerId });
  if (!step) {
    return Promise.reject({ message: 'Шаг не найден' });
  }
  step.complete = !step.complete;
  const savedStep = await step.save();
  return savedStep;
};

export const StepModel = mongoose.model<StepType, StepTypeWithStatic>(
  'Step',
  stepSchema,
  'Step'
);
