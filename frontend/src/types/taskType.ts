export type TaskType = {
  id: string;
  title: string;
  date: string;
  complete: boolean;
  expiredAt: string;
  public: boolean;
  owner: string;
  members: Array<string>;
  steps: Array<string>;
  likes: Array<string>;
};

export type TaskCreateType = Pick<
  TaskType,
  'title' | 'owner' | 'public' | 'expiredAt'
>;

export enum TaskStatus {
  OWN_TASK = 'OWN_TASK',
  PUBLIC_TASK = 'PUBLIC_TASK',
  SHARED_TASK = 'SHARED_TASK',
}
