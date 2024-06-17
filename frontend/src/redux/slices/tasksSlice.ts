import {
  ThunkDispatch,
  UnknownAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { TasksType, TaskType } from '../../types/taskType';
import { RootState, store } from '../store';
import { customFetch } from '../../requests';
import { ErrorTypeFromServer } from '../../types/errorTypes';
import { logout } from './userSlice';

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

// const setTasksPayload = (typeTasks:TasksType,payload:TaskType[])=>{
//   switch(typeTasks) {
//     case 'own': {

//     }
//   }
// }
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

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getTasksAction.fulfilled, (state, action) => {
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
  },
});

export const getTasks = (state: RootState) => state.tasks;

export default tasksSlice.reducer;
