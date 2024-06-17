export type TaskType = {
  _id: string;
  title: string;
  createdAt: string;
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

export type TasksType = 'own' | 'public' | 'shared';
