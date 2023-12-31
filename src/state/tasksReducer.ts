import {TasksStateType} from '../AppWithReducers';
import {v1} from 'uuid';
import {AddTodolistType, RemoveTodolistType, todolistId1, todolistId2} from './todolistsReducer';

const initialState: TasksStateType = {
    [todolistId1]: [
        {id: v1(), title: 'CSS&HTML', isDone: true},
        {id: v1(), title: 'JS', isDone: false},
        {id: v1(), title: 'React', isDone: true},
        {id: v1(), title: 'RestIP', isDone: true}
    ],
    [todolistId2]: [
        {id: v1(), title: 'Book', isDone: true},
        {id: v1(), title: 'Milk', isDone: false},
        {id: v1(), title: 'React', isDone: true}
    ]
}

export const tasksReducer = (state: TasksStateType = initialState, {type, payload}: TasksReducerType): TasksStateType => {
    switch (type) {
        case 'ADD-TASK' : {
            const newTask = {id: v1(), title: payload.title, isDone: false}
            const existingTasks = state[payload.todolistId] || [];

            return {
                ...state,
                [payload.todolistId]: [newTask, ...existingTasks]
            }
        }
        case 'REMOVE-TASK' : {
            return {
                ...state,
                [payload.todolistId]: state[payload.todolistId].filter(tl => tl.id !== payload.taskId)
            }
        }
        case 'CHANGE-TASK-STATUS' : {
            return {
                ...state,
                [payload.todolistId]: state[payload.todolistId].map(t => t.id === payload.taskId ? {
                    ...t,
                    isDone: payload.newIsDoneValue
                } : t)
            }
        }
        case 'CHANGE-TASK-TITLE' : {
            return {
                ...state,
                [payload.todolistId]: state[payload.todolistId].map(t => t.id === payload.taskId ? {
                    ...t,
                    title: payload.newTitle
                } : t)
            }
        }
        case 'REMOVE-TODOLIST' : {
            const {[payload.todolistId]: [], ...rest} = state
            return rest
        }
        case 'ADD-TODOLIST' : {
            return {[payload.todolistId]: [], ...state};
        }

        default:
            return state
    }
}

type TasksReducerType =
    RemoveTaskType
    | AddTaskType
    | ChangeTaskStatusType
    | ChangeTaskTitleType
    | RemoveTodolistType
    | AddTodolistType

type RemoveTaskType = ReturnType<typeof removeTaskAC>
type AddTaskType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>

export const addTaskAC = (todolistId: string, title: string) => {
    return {type: 'ADD-TASK', payload: {todolistId, title}} as const
}

export const removeTaskAC = (todolistId: string, taskId: string) => {
    return {type: 'REMOVE-TASK', payload: {todolistId, taskId}} as const
}

export const changeTaskStatusAC = (todolistId: string, taskId: string, newIsDoneValue: boolean) => {
    return {type: 'CHANGE-TASK-STATUS', payload: {todolistId, taskId, newIsDoneValue}} as const
}

export const changeTaskTitleAC = (todolistId: string, taskId: string, newTitle: string) => {
    return {type: 'CHANGE-TASK-TITLE', payload: {todolistId, taskId, newTitle}} as const
}