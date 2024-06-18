import {
  createAsyncThunk,
  ThunkDispatch,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { customFetch } from '../../requests';
import { StepType } from '../../types/stepTypes';
import {
  TaskType,
  TasksType,
  TaskTypeWithoutStepsField,
} from '../../types/taskType';
import { TasksState } from '../slices/tasksSlice';
import { RootState } from '../store';
import { ErrorTypeFromServer } from './commonTypes';

export const getTasksAction = createAsyncThunk<
  { tasks: TaskType[] } & ErrorTypeFromServer & { tasksType: TasksType },
  {
    token: string;
    type: TasksType;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/getTasks', async (data) => {
  return customFetch({
    to: `/getTasks/${data.type}`,
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json;charset=utf-8',
      Authorization: data.token,
    },
    dispatch: data.dispatch,
  })
    .then((res) => res)
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const getTasksActionBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(getTasksAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    const { tasksType, ...payload } = action.payload;
    const separatedTaskAndSteps = payload.tasks.reduce(
      (
        acc: {
          steps: { [taskId: string]: StepType[] };
          tasks: TaskTypeWithoutStepsField[];
        },
        currentTask
      ) => {
        const { steps, ...task } = currentTask;
        acc.steps[task._id] = steps;
        acc.tasks.push(task);
        return acc;
      },
      { steps: {}, tasks: [] }
    );
    state[tasksType] = separatedTaskAndSteps.tasks;
    state.steps = separatedTaskAndSteps.steps;
  });
  builder.addCase(getTasksAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(getTasksAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
