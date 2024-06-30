import { TaskType, ChangeFieldsTask } from '../../../types/taskType';

export type ChangedTaskReturnedType = {
  success: boolean;
  message: string;
  task: TaskType;
  field: ChangeFieldsTask;
  action: boolean;
  userIdWhoInitiatedChanges: string;
};

export type ErrorTypeFromServer = {
  error: boolean;
  message: string;
};
