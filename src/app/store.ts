import {applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {TasksActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {thunk, ThunkAction} from 'redux-thunk';
import {AppActionsType, appReducer} from './app-reducer';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>
//все типы экшенов для всего App
export type AllActionsType = TodolistsActionsType | TasksActionsType | AppActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AllActionsType>

// @ts-ignore
window.store = store