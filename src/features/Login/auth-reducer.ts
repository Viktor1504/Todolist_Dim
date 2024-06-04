import {AppThunk} from '../../app/store';
import {setAppStatusAC} from '../../app/app-reducer';
import {authAPI, FieldErrorType, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {cleanupOnLogout} from '../../common/actions/common-actions';
import {AxiosError} from 'axios';

export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (err) {
        const error = err as AxiosError
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

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
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer
const {setIsLoggedInAC} = slice.actions
const {setIsInitializedAC} = slice.actions

// thunks
export const logoutTC = (): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(cleanupOnLogout())
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