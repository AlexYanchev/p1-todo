import { createSlice } from '@reduxjs/toolkit';
import { TaskTypeWithoutStepsField, TasksType } from '../../types/taskType';
import { RootState } from '../store';
import { StepType } from '../../types/stepTypes';
import { addStepToTaskBuilder } from '../actionsAndBuilders/addStepToTask';
import { changeCompleteStatusStepActionThunkBuilder } from '../actionsAndBuilders/changeCompleteStatusStep';
import { createTaskActionBuilder } from '../actionsAndBuilders/createTask';
import { deleteStepActionThunkBuilder } from '../actionsAndBuilders/deleteStep';
import { deleteTaskActionBuilder } from '../actionsAndBuilders/deleteTask';
import { getTasksActionBuilder } from '../actionsAndBuilders/getTasks';

export interface TasksState {
  own: TaskTypeWithoutStepsField[];
  public: TaskTypeWithoutStepsField[];
  shared: TaskTypeWithoutStepsField[];
  steps: { [taskId: string]: StepType[] };
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: any;
}

export const initialState: TasksState = {
  own: [],
  public: [],
  shared: [],
  steps: {},
  status: 'idle',
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    getTasksActionBuilder(builder);
    createTaskActionBuilder(builder);
    deleteTaskActionBuilder(builder);
    addStepToTaskBuilder(builder);
    changeCompleteStatusStepActionThunkBuilder(builder);
    deleteStepActionThunkBuilder(builder);
  },
});

// export const { addStepToTaskTask } = tasksSlice.actions;

export const getTasks = (type: TasksType) => (state: RootState) =>
  state.tasks[type];

export const getSpecificSteps = (taskId: string) => (state: RootState) =>
  state.tasks.steps[taskId];
// export const getSpecificSteps =
//   (type: TasksType, taskId: string) => (state: RootState) =>
//     state.tasks[type].find((task) => task._id === taskId)?.steps;

export default tasksSlice.reducer;
