import {
  createAsyncThunk,
  ThunkDispatch,
  ActionReducerMapBuilder,
  PayloadAction,
} from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { customFetch } from '../../../requests';
import { TasksState } from '../../slices/tasksSlice';
import { RootState } from '../../store';
import { ChangedTaskReturnedType, ErrorTypeFromServer } from './commonTypes';
import { ChangeFieldsTask, TasksType } from '../../../types/taskType';
import { UserState } from '../../slices/userSlice';

export type ChangedTaskWithTypeTaskReturnedType = ChangedTaskReturnedType & {
  typeTask: TasksType;
};

export const changeTaskActionThunk = createAsyncThunk<
  { data: ChangedTaskWithTypeTaskReturnedType & ErrorTypeFromServer },
  {
    token: string;
    taskId: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    fields: ChangeFieldsTask;
    typeTask: TasksType;
  }
>('tasks/changeTask', async (data) => {
  return customFetch({
    to: `/changeTask/${data.taskId}`,
    method: 'PATCH',
    headers: {
      Authorization: data.token,
      'Content-Type': 'application/json;charset=utf-8',
    },
    dispatch: data.dispatch,
    data: { fields: data.fields },
  })
    .then((res) => {
      res.data.typeTask = data.typeTask;
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const changeTaskActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(changeTaskActionThunk.fulfilled, (state, action) => {
    state.status = 'fulfilled';

    const desiredTask = state[action.payload.data.typeTask].find(
      (task) => task._id === action.payload.data.task._id
    );
    if (!desiredTask) {
      return state;
    }
    let desiredField = desiredTask[action.payload.data.field];
    if (typeof desiredField === 'boolean') {
      (desiredTask[action.payload.data.field] as boolean) =
        action.payload.data.action;
    } else if (Array.isArray(desiredField)) {
      (desiredTask[action.payload.data.field] as string[]) = action.payload.data
        .task[action.payload.data.field] as string[];
    } else {
      return state;
    }
  });
  builder.addCase(changeTaskActionThunk.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(changeTaskActionThunk.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
