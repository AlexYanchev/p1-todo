import {
  ActionReducerMapBuilder,
  ThunkDispatch,
  UnknownAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { TaskCreateType, TasksType, TaskType } from '../../types/taskType';
import { RootState } from '../store';
import { customFetch } from '../../requests';
import { ErrorTypeFromServer } from '../../types/errorTypes';
import { StepType } from '../../types/stepTypes';
import {
  AddStepToTaskActionReturnedType,
  getTasksActionBuilder,
  createTaskActionBuilder,
  deleteTaskActionBuilder,
  addStepToTaskBuilder,
} from '../actionsAndBuilders/tasks';

export interface TasksState {
  own: TaskType[];
  public: TaskType[];
  shared: TaskType[];
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: any;
}

export const initialState: TasksState = {
  own: [],
  public: [],
  shared: [],
  status: 'idle',
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addStepToTaskTask: (
      state,
      action: PayloadAction<AddStepToTaskActionReturnedType>
    ) => {
      state.own = state.own.map((task) => {
        if (task._id === action.payload.step.taskId) {
          task.steps.push(action.payload.step);
          return task;
        } else {
          return task;
        }
      });
    },
  },
  extraReducers(builder) {
    getTasksActionBuilder(builder);
    createTaskActionBuilder(builder);
    deleteTaskActionBuilder(builder);
    addStepToTaskBuilder(builder);
  },
});

export const { addStepToTaskTask } = tasksSlice.actions;

export const getTasks = (state: RootState) => state.tasks;

export default tasksSlice.reducer;
