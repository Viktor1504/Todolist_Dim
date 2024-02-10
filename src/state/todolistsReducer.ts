import {v1} from 'uuid';
import {TodolistType} from '../api/todolists-api';

export const todolistId1 = v1()
export const todolistId2 = v1()

const initialState: TodolistDomainType[] = [
    {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}
]

export const todolistsReducer = (state: TodolistDomainType[] = initialState, {
    type,
    payload
}: TodolistsReducerType): TodolistDomainType[] => {
    switch (type) {
        case 'ADD-TODOLIST' : {
            const newTodolist: TodolistDomainType = {
                id: payload.todolistId,
                title: payload.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }
            return [newTodolist, ...state]
        }
        case 'REMOVE-TODOLIST' : {
            return state.filter(tl => tl.id !== payload.todolistId)
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === payload.todolistId ? {...tl, title: payload.newTitle} : tl)
        }
        case 'CHANGE-FILTER': {
            return state.map(tl => tl.id === payload.todolistId ? {...tl, filter: payload.value} : tl)
        }
        default:
            return state
    }
}

type TodolistsReducerType = AddTodolistType | RemoveTodolistType | ChangeTodolistTitleType | ChangeFilterType

export type AddTodolistType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistType = ReturnType<typeof removeTodolistAC>
type ChangeTodolistTitleType = ReturnType<typeof changeTodolistTitleAC>
type ChangeFilterType = ReturnType<typeof changeFilterAC>


export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', payload: {todolistId: v1(), title}} as const
}

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', payload: {todolistId}} as const
}

export const changeTodolistTitleAC = (todolistId: string, newTitle: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {todolistId, newTitle}} as const
}

export const changeFilterAC = (todolistId: string, value: FilterValuesType) => {
    return {type: 'CHANGE-FILTER', payload: {todolistId, value}} as const
}