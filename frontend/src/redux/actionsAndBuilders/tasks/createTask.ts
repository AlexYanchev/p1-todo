import {
  createAsyncThunk,
  ThunkDispatch,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { customFetch } from '../../../requests';
import { TaskType, TaskCreateType } from '../../../types/taskType';
import { TasksState } from '../../slices/tasksSlice';
import { RootState } from '../../store';
import { ErrorTypeFromServer } from './commonTypes';

export const createTaskAction = createAsyncThunk<
  TaskType & ErrorTypeFromServer,
  {
    task: TaskCreateType;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/createTask', async (data) => {
  return customFetch({
    to: '/createTask',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: data.token,
    },
    data: data.task,
  })
    .then((res) => res)
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const createTaskActionBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(createTaskAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    const { steps, ...task } = action.payload;
    state.own = [task, ...state.own];
    state.steps[task._id] = steps;
  });
  builder.addCase(createTaskAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(createTaskAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
