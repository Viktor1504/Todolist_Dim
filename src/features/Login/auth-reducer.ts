import {AppThunk} from '../../app/store';
import {setAppStatusAC} from '../../app/app-reducer';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearAllTodolistsAC} from '../TodolistsList/todolists-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        isInitialized: false
    },
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{ value: boolean }>) => {
            state.isLoggedIn = action.payload.value
        },
        setIsInitializedAC: (state, action: PayloadAction<{ value: boolean }>) => {
            state.isInitialized = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
const {setIsLoggedInAC} = slice.actions
const {setIsInitializedAC} = slice.actions

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = (): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(clearAllTodolistsAC({}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const initializeAppTC = (): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
            dispatch(setIsInitializedAC({value: true}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}