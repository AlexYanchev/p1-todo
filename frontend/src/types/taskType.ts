import { StepType } from './stepTypes';

export type TaskType = {
  _id: string;
  title: string;
  createdAt: string;
  complete: boolean;
  expiredAt: string;
  public: boolean;
  owner: string;
  members: Array<string>;
  steps: Array<StepType>;
  likes: Array<string>;
  expired: boolean;
  willBeDeleted: Date | null;
};

export type TaskCreateType = Pick<TaskType, 'title' | 'public' | 'expiredAt'>;

export type TasksType = 'own' | 'public' | 'shared';

export type TaskTypeWithoutStepsField = Omit<TaskType, 'steps'>;

export type ChangeFieldsTask = 'complete' | 'likes' | 'members' | 'public';
