export type StepType = {
  id: string;
  owner: string;
  title: string;
  taskId: string;
  complete: boolean;
};

export type StepCreateType = Pick<StepType, 'owner' | 'taskId' | 'title'>;
