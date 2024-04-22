import {AppThunk} from '../../app/store';
import {setAppStatusAC} from '../../app/app-reducer';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearAllTodolistsAC} from '../TodolistsList/todolists-reducer';

const initialState: AuthStateType = {
    isLoggedIn: false,
    isInitialized: false
}

export const authReducer = (state: AuthStateType = initialState, action: LoginActionsType): AuthStateType => {
    switch (action.type) {
        case 'login/SET-IS_LOGIN':
            return {...state, isLoggedIn: action.value}
        case 'login/SET-IS-INITIALIZED-IN':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

//actions
export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS_LOGIN', value}) as const
export const setIsInitializedAC = (value: boolean) => ({type: 'login/SET-IS-INITIALIZED-IN', value}) as const

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = (): AppThunk => dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(clearAllTodolistsAC())
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const initializeAppTC = (): AppThunk => dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
            dispatch(setIsInitializedAC(true))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export type AuthStateType = {
    isLoggedIn: boolean
    isInitialized: boolean
}

type LoginActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setIsInitializedAC>