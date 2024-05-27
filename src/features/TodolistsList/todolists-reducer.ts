import {todolistsApi, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AppThunk} from '../../app/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {cleanupOnLogout} from '../../common/actions/common-actions';

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        removeTodolistAC: (state, action: PayloadAction<{ todolistId: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC: (state, action: PayloadAction<TodolistType>) => {
            state.unshift({...action.payload, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC: (state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{
            todolistId: string,
            status: RequestStatusType
        }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.status
        },
        setTodolistsAC: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(cleanupOnLogout, () => {
            return []
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    setTodolistsAC,
} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsApi.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC({todolists: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId, status: 'loading'}))
    todolistsApi.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC({todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsApi.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            debugger
            handleServerNetworkError(error, dispatch)
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    todolistsApi.updateTodolist(todolistId, title)
        .then(() => {
            dispatch(changeTodolistTitleAC({todolistId, title: title}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}