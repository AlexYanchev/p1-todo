import { TaskType } from '../../../types/taskType';

export type ChangedTaskReturnedType = {
  success: boolean;
  message: string;
  task: TaskType;
};

export type ErrorTypeFromServer = {
  error: boolean;
  message: string;
};
