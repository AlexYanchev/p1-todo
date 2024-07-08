export type StepType = {
  _id: string;
  owner: string;
  title: string;
  taskId: string;
  complete: boolean;
};

export type StepCreateType = Pick<StepType, 'owner' | 'taskId' | 'title'>;

export type OfferStepType = Pick<StepType, '_id' | 'title'> & {
  task: { title: string };
  proposedBy: {
    firstName: string;
    lastName: string;
    _id: string;
    login: string;
  };
};
