import {combineReducers, legacy_createStore} from 'redux';
import {tasksReducer} from './tasksReducer';
import {todolistsReducer} from './todolistsReducer';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer)

// @ts-ignore
window.store = store