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
  ChangedTaskWithTypeTaskReturnedType & ErrorTypeFromServer,
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
      res.typeTask = data.typeTask;
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const changeTaskActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    changeTaskActionThunk.fulfilled,
    (state, action: PayloadAction<ChangedTaskWithTypeTaskReturnedType>) => {
      state.status = 'fulfilled';

      const desiredTask = state[action.payload.typeTask].find(
        (task) => task._id === action.payload.task._id
      );
      if (!desiredTask) {
        return state;
      }
      let desiredField = desiredTask[action.payload.field];
      if (typeof desiredField === 'boolean') {
        (desiredTask[action.payload.field] as boolean) = action.payload.action;
      } else if (Array.isArray(desiredField)) {
        (desiredTask[action.payload.field] as string[]) = action.payload.task[
          action.payload.field
        ] as string[];
      } else {
        return state;
      }
    }
  );
  builder.addCase(changeTaskActionThunk.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(changeTaskActionThunk.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
