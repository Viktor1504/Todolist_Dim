import {todolistsReducer} from './state/todolistsReducer';
import {v1} from 'uuid';
import {combineReducers} from 'redux';
import {tasksReducer} from './state/tasksReducer';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all'}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'CSS&HTML', isDone: true},
            {id: v1(), title: 'JS', isDone: false},
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Book', isDone: true},
            {id: v1(), title: 'Milk', isDone: false},
        ]
    }
}

// export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootState)

// export const ReduxStoreProviderDecorator = (storyFn: any) => {
//     return <Provider store={storyBookStore}>{storyFn()}</Provider>
// }
//
