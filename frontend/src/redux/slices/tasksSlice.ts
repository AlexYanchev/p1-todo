import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TaskTypeWithoutStepsField, TasksType } from '../../types/taskType';
import { RootState } from '../store';
import { StepType } from '../../types/stepTypes';
import { addStepToTaskBuilder } from '../actionsAndBuilders/tasks/addStepToTask';
import { changeCompleteStatusStepActionThunkBuilder } from '../actionsAndBuilders/tasks/changeCompleteStatusStep';
import { createTaskActionBuilder } from '../actionsAndBuilders/tasks/createTask';
import { deleteStepActionThunkBuilder } from '../actionsAndBuilders/tasks/deleteStep';
import { deleteTaskActionBuilder } from '../actionsAndBuilders/tasks/deleteTask';
import { getTasksActionBuilder } from '../actionsAndBuilders/tasks/getTasks';
import { changeCompleteStatusTaskActionThunkBuilder } from '../actionsAndBuilders/tasks/changeCompleteStatusTask';
import { changePublicStatusTaskActionThunkBuilder } from '../actionsAndBuilders/tasks/changePublicStatusTask';
import { putLikeToTaskActionThunkBuilder } from '../actionsAndBuilders/tasks/putLikeToTask';
import { joinToTaskActionThunkBuilder } from '../actionsAndBuilders/tasks/joinToTask';

export interface TasksState {
  own: TaskTypeWithoutStepsField[];
  public: TaskTypeWithoutStepsField[];
  shared: TaskTypeWithoutStepsField[];
  steps: { [taskId: string]: StepType[] };
  waitingToDelete: string | null;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: any;
}

export const initialState: TasksState = {
  own: [],
  public: [],
  shared: [],
  steps: {},
  waitingToDelete: null,
  status: 'idle',
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    deleteTaskFromStore: (state, action: PayloadAction<{ taskId: string }>) => {
      state.own = state.own.filter(
        (task) => task._id !== action.payload.taskId
      );
    },
  },
  extraReducers(builder) {
    getTasksActionBuilder(builder);
    createTaskActionBuilder(builder);
    deleteTaskActionBuilder(builder);
    addStepToTaskBuilder(builder);
    changeCompleteStatusStepActionThunkBuilder(builder);
    deleteStepActionThunkBuilder(builder);
    changeCompleteStatusTaskActionThunkBuilder(builder);
    changePublicStatusTaskActionThunkBuilder(builder);
    putLikeToTaskActionThunkBuilder(builder);
    joinToTaskActionThunkBuilder(builder);
  },
});

export const { deleteTaskFromStore } = tasksSlice.actions;

export const getWaitingToDeleteTask = (state: RootState) =>
  state.tasks.waitingToDelete;

export const getTasks = (type: TasksType) => (state: RootState) =>
  state.tasks[type];

export const getSpecificTask =
  (type: TasksType, taskId: string) => (state: RootState) =>
    state.tasks[type].find((task) => task._id === taskId);

export const getSpecificSteps = (taskId: string) => (state: RootState) =>
  state.tasks.steps[taskId];
// export const getSpecificSteps =
//   (type: TasksType, taskId: string) => (state: RootState) =>
//     state.tasks[type].find((task) => task._id === taskId)?.steps;

export default tasksSlice.reducer;
