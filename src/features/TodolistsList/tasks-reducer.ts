import {TaskPriorities, TaskStatuses, TaskType, todolistsApi, UpdateTaskModelType} from '../../api/todolists-api';
import {AppRootStateType, AppThunk} from '../../app/store';
import {setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {cleanupOnLogout} from '../../common/actions/common-actions';

const slice = createSlice({
        name: 'tasks',
        initialState: {} as TasksStateType,
        reducers: {
            removeTaskAC: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks.splice(index, 1)
                }
            },
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
            },
            setTasksAC: (state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) => {
                state[action.payload.todolistId] = action.payload.tasks
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
        }
    }
)

export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC} = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsApi.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC({todolistId, tasks: res.data.items}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsApi.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({todolistId, taskId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
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
