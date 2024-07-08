import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store.js';
import { ArchiveTasksFields, OfferTaskType } from '../../types/taskType';
import { OfferStepType } from '../../types/stepTypes';
import { getArchiveTasksThunkActionBuilder } from '../actionsAndBuilders/profileData/archiveTasks/getArchiveTasks';
import { getOffersThunkActionBuilder } from '../actionsAndBuilders/profileData/offers/getOffers';
import { changeOfferTaskThunkActionBuilder } from '../actionsAndBuilders/profileData/offers/changeOfferTask';
import { changeOfferStepThunkActionBuilder } from '../actionsAndBuilders/profileData/offers/changeOfferStep';
import { FriendSimpleProfileType } from '../../types/userType.js';
import { getFriendsListThunkActionBuilder } from '../actionsAndBuilders/profileData/friends/getFriendsList';
import { changeFriendsListThunkActionBuilder } from '../actionsAndBuilders/profileData/friends/changeFriendsList';

export type RequestStatus = {
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: any;
};

export interface ProfileDataState {
  archiveTasks: RequestStatus & {
    expiredTasks: Array<ArchiveTasksFields>;
    completedTasks: Array<ArchiveTasksFields>;
    deletedTasks: Array<ArchiveTasksFields>;
  };
  offers: RequestStatus & {
    sharedToMeTasks: Array<OfferTaskType>;
    sharedToMeSteps: Array<OfferStepType>;
  };
  friendsList: RequestStatus & { data: Array<FriendSimpleProfileType> };
}

const initialState: ProfileDataState = {
  archiveTasks: {
    status: 'idle',
    error: null,
    expiredTasks: [],
    completedTasks: [],
    deletedTasks: [],
  },
  offers: {
    status: 'idle',
    error: null,
    sharedToMeTasks: [],
    sharedToMeSteps: [],
  },
  friendsList: { status: 'idle', error: null, data: [] },
};

export const profileDataSlice = createSlice({
  name: 'profileData',
  initialState,
  reducers: {},
  extraReducers(builder) {
    getArchiveTasksThunkActionBuilder(builder);
    getOffersThunkActionBuilder(builder);
    changeOfferTaskThunkActionBuilder(builder);
    changeOfferStepThunkActionBuilder(builder);
    getFriendsListThunkActionBuilder(builder);
    changeFriendsListThunkActionBuilder(builder);
  },
});

export const getArchiveTasks = createSelector(
  [
    (state: RootState) => state.profileData.archiveTasks.expiredTasks,
    (state: RootState) => state.profileData.archiveTasks.completedTasks,
    (state: RootState) => state.profileData.archiveTasks.deletedTasks,
  ],
  (expiredTasks, completedTasks, deletedTasks) => ({
    expiredTasks,
    completedTasks,
    deletedTasks,
  })
);

export const getOffers = createSelector(
  [
    (state: RootState) => state.profileData.offers.sharedToMeTasks,
    (state: RootState) => state.profileData.offers.sharedToMeSteps,
  ],
  (sharedToMeTasks, sharedToMeSteps) => ({ sharedToMeTasks, sharedToMeSteps })
);

export const getFriendsList = (state: RootState) =>
  state.profileData.friendsList.data;

export default profileDataSlice.reducer;
