import {addTaskAC, removeTaskAC, setTasksAC, tasksReducer, TasksStateType, updateTaskAC} from './tasks-reducer';
import {v1} from 'uuid';
import {addTodolistAC, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolists-api';

let taskId1: string = v1()
let taskId2: string = v1()

const startState: TasksStateType = {
    ['todolistId1']: [
        {
            id: taskId1,
            title: 'CSS&HTML',
            status: TaskStatuses.New,
            todoListId: 'todolistId1',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: ''
        }
    ],
    ['todolistId2']: [
        {
            id: taskId2,
            title: 'Book',
            todoListId: 'todolistId2',
            status: TaskStatuses.New,
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: ''
        }
    ]
}

test('correct task should be removed from the specified todolist', () => {

    const action = removeTaskAC({todolistId: 'todolistId1', taskId: taskId1})
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(0)
    expect(endState['todolistId2'].length).toBe(1)
    expect(endState['todolistId1'].every((task) => task.id !== taskId1)).toBeTruthy()
})

test('correct task should be added to the specified todolist', () => {
    let newTaskTitle = 'New Task';

    const action = addTaskAC({
        task: {
            todoListId: 'todolistId2',
            title: newTaskTitle,
            status: TaskStatuses.New,
            addedDate: '',
            deadline: '',
            description: '',
            order: 0,
            priority: 0,
            startDate: '',
            id: 'id exists'
        }
    })
    const endState = tasksReducer(startState, action);

    expect(endState['todolistId1'].length).toBe(1);
    expect(endState['todolistId2'].length).toBe(2);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe(newTaskTitle);
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
})

test('correct task status should be changed in the specified todolist', () => {

    const action = updateTaskAC({todolistId: 'todolistId1', taskId: taskId1, model: {status: TaskStatuses.Completed}});
    const endState = tasksReducer(startState, action);

    expect(endState['todolistId1'][0].status === TaskStatuses.Completed).toBeTruthy()
});

test('correct task title should be changed in the specified todolist', () => {

    let newTitle = 'Updated Task';

    const action = updateTaskAC({todolistId: 'todolistId1', taskId: taskId1, model: {title: newTitle}});
    const endState = tasksReducer(startState, action);

    expect(endState['todolistId1'][0].title).toBe(newTitle);
});

test('correct todolist should be added', () => {

    const action = addTodolistAC({
        todolist: {
            id: v1(),
            title: 'title',
            addedDate: '',
            order: 0
        }
    })

    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) throw Error('new key should be added')

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toStrictEqual([]);
})

test('empty arrays should be added when set todolists', () => {
    const action = setTodolistsAC({
        todolists: [
            {id: '1', title: 'What to learn', order: 0, addedDate: ''},
            {id: '2', title: 'What to buy', order: 0, addedDate: ''}
        ]
    })

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
    const action = setTasksAC({todolistId: 'todolistId1', tasks: startState['todolistId1']})

    const endState = tasksReducer({
        'todolistId1': [],
        'todolistId2': []
    }, action)

    expect(endState['todolistId1'].length).toBe(1)
    expect(endState['todolistId2'].length).toBe(0)
})