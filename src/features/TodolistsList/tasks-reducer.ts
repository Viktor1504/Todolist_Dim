import {TaskPriorities, TaskStatuses, TaskType, todolistsApi, UpdateTaskModelType} from '../../api/todolists-api';
import {AppRootStateType, AppThunk} from '../../app/store';
import {setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {cleanupOnLogout} from '../../common/actions/common-actions';

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let res = await todolistsApi.getTasks(todolistId);
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolistId, tasks: res.data.items}
    } catch (error) {
        // handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null)
    }
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: {
    todolistId: string,
    taskId: string
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsApi.deleteTask(param.todolistId, param.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId: param.todolistId, taskId: param.taskId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        // handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

const slice = createSlice({
        name: 'tasks',
        initialState: {} as TasksStateType,
        reducers: {
            addTaskAC: (state, action: PayloadAction<TaskType>) => {
                state[action.payload.todoListId].unshift(action.payload)
            },
            updateTaskAC: (state, action: PayloadAction<{
                todolistId: string,
                taskId: string,
                model: UpdateDomainTaskModelType
            }>) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            }
        },
        extraReducers: (builder) => {
            builder.addCase(addTodolistAC, (state, action) => {
                state[action.payload.id] = []
            })
            builder.addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.todolistId]
            })
            builder.addCase(setTodolistsAC, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            builder.addCase(cleanupOnLogout, () => {
                return {}
            })
            builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            builder.addCase(removeTaskTC.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex(t => t.id === action.payload.taskId)
                    if (index !== -1) {
                        tasks.splice(index, 1)
                    }
                }
            })
        }
    }
)

export const tasksReducer = slice.reducer
export const {addTaskAC, updateTaskAC} = slice.actions

// thunks

export const addTaskTC = (todolistId: string, taskTitle: string): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsApi.createTask(todolistId, taskTitle)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state!')
            return
        }

        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel
        }

        todolistsApi.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({todolistId, taskId, model: domainModel}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

// types
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: TaskType[]
}
