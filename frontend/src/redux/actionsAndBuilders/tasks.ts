import {
  createAsyncThunk,
  ThunkDispatch,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { customFetch } from '../../requests';
import { ErrorTypeFromServer } from '../../types/errorTypes';
import { StepType } from '../../types/stepTypes';
import { TaskType, TaskCreateType, TasksType } from '../../types/taskType';
import { TasksState } from '../slices/tasksSlice';
import { RootState } from '../store';

export type AddStepToTaskActionReturnedType = {
  success: boolean;
  message: string;
  _id: string;
  step: StepType;
} & ErrorTypeFromServer;

export const addStepToTaskAction = createAsyncThunk<
  AddStepToTaskActionReturnedType,
  {
    id: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    step: { title: string };
  }
>('tasks/addStepToTask', async (data) => {
  return customFetch({
    to: `/addStepToTask/${data.id}`,
    method: 'PATCH',
    headers: {
      Authorization: data.token,
      'Content-Type': 'application/json;charset=utf-8',
    },
    dispatch: data.dispatch,
    data: data.step,
  })
    .then((res) => res)
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const addStepToTaskBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(addStepToTaskAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    state.own = state.own.map((task) => {
      if (task._id === action.payload._id) {
        task.steps.push(action.payload.step);
      }
      return task;
    });
  });
  builder.addCase(addStepToTaskAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(addStepToTaskAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};

export const deleteTaskAction = createAsyncThunk<
  { success: boolean; message: string; _id: string } & ErrorTypeFromServer,
  {
    id: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/deleteTask', async (data) => {
  return customFetch({
    to: `/deleteTask/${data.id}`,
    method: 'DELETE',
    headers: {
      Authorization: data.token,
    },
    dispatch: data.dispatch,
  })
    .then((res) => res)
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const deleteTaskActionBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(deleteTaskAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    state.own = state.own.filter((task) => task._id !== action.payload._id);
  });
  builder.addCase(deleteTaskAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(deleteTaskAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};

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
    state.own = [action.payload, ...state.own];
  });
  builder.addCase(createTaskAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(createTaskAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};

export const getTasksAction = createAsyncThunk<
  { tasks: TaskType[] } & ErrorTypeFromServer & { type: TasksType },
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
    .then((res) => {
      res.type = data.type;
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const getTasksActionBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(getTasksAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    const { type, ...payload } = action.payload;
    state[type] = payload.tasks;
  });
  builder.addCase(getTasksAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(getTasksAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
