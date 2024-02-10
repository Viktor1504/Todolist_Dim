import {todolistId1, todolistsReducer} from './state/todolistsReducer';
import {v1} from 'uuid';
import {combineReducers} from 'redux';
import {tasksReducer} from './state/tasksReducer';
import {TaskPriorities, TaskStatuses} from './api/todolists-api';
import {AppRootState} from './state/store';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

const initialGlobalState: AppRootState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', order: 0, addedDate: ''},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', order: 0, addedDate: ''}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'CSS&HTML',
                status: TaskStatuses.New,
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
            },
        ],
        ['todolistId2']: [
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
}

// export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootState)

// export const ReduxStoreProviderDecorator = (storyFn: any) => {
//     return <Provider store={storyBookStore}>{storyFn()}</Provider>
// }
//
