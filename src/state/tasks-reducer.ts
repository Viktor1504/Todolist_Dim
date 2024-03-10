import {TasksStateType} from '../AppWithReducers';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsApi, UpdateTaskModelType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {AppRootState} from './store';

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, {type, payload}: ActionsType): TasksStateType => {
    switch (type) {
        case 'ADD-TASK' : {
            const {task} = payload
            return {...state, [task.todoListId]: [task, ...state[task.todoListId]]}
        }
        case 'REMOVE-TASK' : {
            const {todolistId, taskId} = payload
            return {...state, [todolistId]: state[todolistId].filter(tl => tl.id !== taskId)}
        }
        case 'UPDATE-TASK' : {
            const {todolistId, taskId, model} = payload
            return {...state, [todolistId]: state[todolistId].map(t => t.id === taskId ? {...t, ...model} : t)}
        }
        case 'REMOVE-TODOLIST' : {
            const {[payload.todolistId]: [], ...rest} = state
            return rest
        }
        case 'ADD-TODOLIST' :
            return {...state, [payload.todolist.id]: []}
        case 'SET-TODOLISTS' : {
            const copyState = {...state}
            payload.todolists.forEach(tl => copyState[tl.id] = [])
            return copyState
        }
        case 'SET-TASKS' : {
            return {...state, [payload.todolistId]: payload.tasks};
        }
        default:
            return state
    }
}

// actions
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', payload: {task}}) as const
export const removeTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE-TASK', payload: {todolistId, taskId}}) as const
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
    ({type: 'UPDATE-TASK', payload: {todolistId, taskId, model}}) as const
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', payload: {todolistId, tasks}}) as const

// thunks
export const fetchTasksTC = (todoListId: string) => (dispatch: Dispatch) => {
    todolistsApi.getTasks(todoListId)
        .then(res => {
            dispatch(setTasksAC(todoListId, res.data.items))
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsApi.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(todolistId, taskId))
        })
}
export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: Dispatch) => {
    todolistsApi.createTask(todolistId, taskTitle)
        .then(res => {
            dispatch(addTaskAC(res.data.data.item))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootState) => {
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
                dispatch(updateTaskAC(todolistId, taskId, domainModel))
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
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
