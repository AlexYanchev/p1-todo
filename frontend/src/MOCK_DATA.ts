import { StepType } from './types/stepTypes';
import { TaskType } from './types/taskType';
import { UserType } from './types/userType';

const date = new Date().toLocaleString();

export const steps: StepType[] = [
  {
    id: '121',
    owner: '1',
    title: 'step-1',
    taskId: 'sdd',
    complete: false,
  },
  {
    id: '122',
    owner: '1',
    title: 'step-2',
    taskId: 'sddf',
    complete: false,
  },
  {
    id: '123',
    owner: '1',
    title: 'step-3',
    taskId: 'sdds',
    complete: false,
  },
  {
    id: '123',
    owner: '2',
    title: 'step-4',
    taskId: 'sddc',
    complete: false,
  },
];

export const tasks: TaskType[] = [
  {
    id: 'fd',
    title: 'Zagolovok 1',
    date: date,
    complete: false,
    expiredAt: date,
    public: false,
    owner: '1',
    members: [],
    steps: ['121', '122'],
    likes: [],
  },
  {
    id: 'fded',
    title: 'Zagolovok 2',
    date: date,
    complete: false,
    expiredAt: date,
    public: false,
    owner: '1',
    members: [],
    steps: ['123'],
    likes: [],
  },
  {
    id: 'fddcd',
    title: 'Zagolovok 3',
    date: date,
    complete: false,
    expiredAt: date,
    public: false,
    owner: '1',
    members: [],
    steps: [],
    likes: [],
  },
  {
    id: 'fdcdc',
    title: 'Zagolovok 4',
    date: date,
    complete: false,
    expiredAt: date,
    public: true,
    owner: '2',
    members: [],
    steps: [],
    likes: [],
  },
];

export const users: UserType[] = [
  {
    id: '1',
    login: 'any',
    firstName: 'Alex',
    lastName: 'Born',
    password: 'any',
    avatar: 'none',
    taskList: ['fd', 'fded', 'fddcd'],
  },
];
