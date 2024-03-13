import {todolistsApi, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setStatusAC, SetStatusActionType} from '../../app/app-reducer';

export const initialState: TodolistDomainType[] = []

export const todolistsReducer = (state = initialState, {type, payload}: ActionsType): TodolistDomainType[] => {
    switch (type) {
        case 'ADD-TODOLIST':
            return [{...payload.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== payload.todolistId)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === payload.todolistId ? {...tl, title: payload.newTitle} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === payload.todolistId ? {...tl, filter: payload.value} : tl)
        case 'SET-TODOLISTS':
            return payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        default:
            return state
    }
}

// actions
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', payload: {todolist}}) as const
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', payload: {todolistId}}) as const
export const changeTodolistTitleAC = (todolistId: string, newTitle: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', payload: {todolistId, newTitle}}) as const
export const changeTodolistFilterAC = (todolistId: string, value: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', payload: {todolistId, value}}) as const
export const setTodolistsAC = (todolists: TodolistType[]) => ({type: 'SET-TODOLISTS', payload: {todolists}}) as const

// thunks
export const fetchTodolistsTC = () => (dispatch: ThunkDispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsApi.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setStatusAC('succeeded'))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsApi.deleteTodolist(todolistId)
        .then(res => {
            dispatch(removeTodolistAC(todolistId))
        })
}
export const addTodolistTC = (title: string) => (dispatch: ThunkDispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsApi.createTodolist(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setStatusAC('succeeded'))
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsApi.updateTodolist(todolistId, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        })
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
type ActionsType =
    | AddTodolistActionType
    | RemoveTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<ActionsType | SetStatusActionType>