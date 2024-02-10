import {TasksStateType} from '../AppWithReducers';
import {v1} from 'uuid';
import {AddTodolistType, RemoveTodolistType, todolistId1, todolistId2} from './todolistsReducer';
import {TaskPriorities, TaskStatuses} from '../api/todolists-api';

const initialState: TasksStateType = {
    [todolistId1]: [
        {
            id: v1(),
            title: 'CSS&HTML',
            status: TaskStatuses.Completed,
            todoListId: todolistId1,
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: ''
        },
        {
            id: v1(),
            title: 'JS',
            status: TaskStatuses.Completed,
            todoListId: todolistId1,
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: ''
        }
    ],
    [todolistId2]: [
        {
            id: v1(),
            title: 'Book',
            status: TaskStatuses.Completed,
            todoListId: todolistId1,
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: ''
        },
        {
            id: v1(),
            title: 'Milk',
            status: TaskStatuses.Completed,
            todoListId: todolistId1,
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: ''
        },
    ]
}

export const tasksReducer = (state: TasksStateType = initialState, {
    type,
    payload
}: TasksReducerType): TasksStateType => {
    switch (type) {
        case 'ADD-TASK' : {
            const newTask = {
                id: v1(),
                title: payload.title,
                status: TaskStatuses.New,
                todoListId: payload.todolistId,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }

            return {
                ...state,
                [payload.todolistId]: [newTask, ...state[payload.todolistId]]
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
                    status: payload.status
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

export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return {type: 'CHANGE-TASK-STATUS', payload: {todolistId, taskId, status}} as const
}

export const changeTaskTitleAC = (todolistId: string, taskId: string, newTitle: string) => {
    return {type: 'CHANGE-TASK-TITLE', payload: {todolistId, taskId, newTitle}} as const
}