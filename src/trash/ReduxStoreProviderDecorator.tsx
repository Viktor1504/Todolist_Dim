// import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
// import {v1} from 'uuid';
// import {combineReducers, legacy_createStore} from 'redux';
// import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
// import {TaskPriorities, TaskStatuses} from '../api/todolists-api.js';
// import {AppRootState} from '../app/store';
// import {Provider} from 'react-redux';
// import React from 'react';
//
// const rootReducer = combineReducers({
//     todolists: todolistsReducer,
//     tasks: tasksReducer
// })
//
// const initialGlobalState: AppRootState = {
//     todolists: [
//         {id: 'todolistId1', title: 'What to learn', filter: 'all', order: 0, addedDate: ''},
//         {id: 'todolistId2', title: 'What to buy', filter: 'all', order: 0, addedDate: ''}
//     ],
//     tasks: {
//         ['todolistId1']: [
//             {
//                 id: v1(),
//                 title: 'CSS&HTML',
//                 status: TaskStatuses.New,
//                 todoListId: 'todolistId1',
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 0,
//                 priority: TaskPriorities.Low,
//                 description: ''
//             },
//             {
//                 id: v1(),
//                 title: 'JS',
//                 status: TaskStatuses.Completed,
//                 todoListId: 'todolistId1',
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 0,
//                 priority: TaskPriorities.Low,
//                 description: ''
//             },
//         ],
//         ['todolistId2']: [
//             {
//                 id: v1(),
//                 title: 'Book',
//                 status: TaskStatuses.Completed,
//                 todoListId: 'todolistId1',
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 0,
//                 priority: TaskPriorities.Low,
//                 description: ''
//             },
//             {
//                 id: v1(),
//                 title: 'Milk',
//                 status: TaskStatuses.Completed,
//                 todoListId: 'todolistId1',
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 0,
//                 priority: TaskPriorities.Low,
//                 description: ''
//             },
//         ]
//     }
// }
