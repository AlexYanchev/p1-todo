export type TaskType = {
  id: string;
  title: string;
  date: Date;
  complete: boolean;
  expiredAt: Date;
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
