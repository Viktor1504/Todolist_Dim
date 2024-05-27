import {AppRootStateType} from './store';

export const selectStatus = (state: AppRootStateType) => state.app.status
export const selectIsInitialized = (state: AppRootStateType) => state.auth.isInitialized
export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isInitialized