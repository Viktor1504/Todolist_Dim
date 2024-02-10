import React, {useReducer} from 'react';
import './App.css';
import {TodoList} from './TuduList';
import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './state/tasksReducer';
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC,
    todolistsReducer
} from './state/todolistsReducer';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses, TaskType} from './api/todolists-api';

export type TasksStateType = {
    [key: string]: TaskType[]
}

function AppWithReducers() {

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, dispatchToTodolistsReducer] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}
    ])

    const [tasks, dispatchToTasksReducer] = useReducer(tasksReducer, {
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
                todoListId: todolistId2,
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
                todoListId: todolistId2,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            },
        ]
    })

    const addTask = (todolistId: string, title: string) => {
        dispatchToTasksReducer(addTaskAC(todolistId, title))
    }

    const removeTask = (todolistId: string, taskId: string) => {
        dispatchToTasksReducer(removeTaskAC(todolistId, taskId))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, status: TaskStatuses) => {
        dispatchToTasksReducer(changeTaskStatusAC(todolistId, taskId, status))
    }

    const changeTaskTitle = (todolistId: string, taskId: string, newTitle: string) => {
        dispatchToTasksReducer(changeTaskTitleAC(todolistId, taskId, newTitle))
    }

    const addTodolist = (title: string) => {
        const action = addTodolistAC(title)
        dispatchToTodolistsReducer(action)
        dispatchToTasksReducer(action)
    }

    const removeTodolist = (todolistId: string) => {
        dispatchToTodolistsReducer(removeTodolistAC(todolistId))
        dispatchToTasksReducer(removeTodolistAC(todolistId))
    }

    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        dispatchToTodolistsReducer(changeTodolistTitleAC(todolistId, newTitle))
    }

    const changeFilter = (todolistId: string, value: FilterValuesType) => {
        dispatchToTodolistsReducer(changeFilterAC(todolistId, value))
    }

    const getFilteredTasks = (allTasks: TaskType[], newFilterValue: FilterValuesType): TaskType[] => {
        switch (newFilterValue) {
            case 'active':
                return allTasks.filter(t => t.status === TaskStatuses.New)
            case 'completed':
                return allTasks.filter(t => t.status === TaskStatuses.Completed)
            default:
                return allTasks
        }
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container style={{padding: '10px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists && todolists.map(tl => {

                        const filteredTasks: TaskType[] = getFilteredTasks(tasks[tl.id], tl.filter)

                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <TodoList
                                        key={tl.id}
                                        todoListId={tl.id}
                                        title={tl.title}
                                        tasks={filteredTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </div>
    )
}

export default AppWithReducers;