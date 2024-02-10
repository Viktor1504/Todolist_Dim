import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './tasksReducer';
import {v1} from 'uuid';
import {addTodolistAC} from './todolistsReducer';
import {TaskPriorities, TaskStatuses} from '../api/todolists-api';

test('correct task should be added to the specified todolist', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let newTaskTitle = 'New Task';

    const startState = {
        [todolistId1]: [
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
            }
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: 'Book',
                todoListId: todolistId2,
                status: TaskStatuses.New,
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
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }
        ]
    };

    const action = addTaskAC(todolistId2, newTaskTitle);
    const endState = tasksReducer(startState, action);

    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(4);
    expect(endState[todolistId2][0].id).toBeDefined();
    expect(endState[todolistId2][0].title).toBe(newTaskTitle);
    expect(endState[todolistId2][0].status).toBe(TaskStatuses.New);
});

test('correct task should be removed from the specified todolist', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let taskId1 = v1();

    const startState = {
        [todolistId1]: [
            {
                id: taskId1,
                title: 'Task 1',
                todoListId: todolistId1,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            },
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: 'Book',
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
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
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }
        ]
    };

    const action = removeTaskAC(todolistId1, taskId1);
    const endState = tasksReducer(startState, action);

    expect(endState[todolistId1].length).toBe(1);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1].every((task) => task.id !== taskId1)).toBeTruthy()
});

test('correct task status should be changed in the specified todolist', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let taskId1 = v1();

    const startState = {
        [todolistId1]: [
            {
                id: taskId1,
                title: 'Task 1',
                todoListId: todolistId1,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            },
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: 'Book',
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
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
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }
        ]
    };

    const action = changeTaskStatusAC(todolistId1, taskId1, TaskStatuses.Completed);
    const endState = tasksReducer(startState, action);

    expect(endState[todolistId1][0].status === TaskStatuses.Completed).toBeTruthy()
});

test('correct task title should be changed in the specified todolist', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let taskId1 = v1();
    let newTitle = 'Updated Task';

    const startState = {
        [todolistId1]: [
            {
                id: taskId1,
                title: 'Task 1',
                todoListId: todolistId1,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            },
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: 'Book',
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
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
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }
        ]
    };

    const action = changeTaskTitleAC(todolistId1, taskId1, newTitle);
    const endState = tasksReducer(startState, action);

    expect(endState[todolistId1][0].title).toBe(newTitle);
});

test('correct todolist should be added', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let newTodolistId = v1();

    const startState = {
        [todolistId1]: [
            {
                id: v1(),
                title: 'Task 1',
                todoListId: todolistId1,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            },
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: 'Book',
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
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
                todoListId: todolistId2,
                status: TaskStatuses.Completed,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }
        ]
    };


    const action = addTodolistAC(newTodolistId);
    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != todolistId1 && k != todolistId2)
    if (!newKey) throw Error('new key should be added')

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toStrictEqual([]);
});
