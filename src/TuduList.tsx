import React from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import CheckBox from './componenst/CheckBox';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: TaskType[]
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todoListId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
    filter: FilterValuesType
    removeTodolist: (todolistId: string) => void
}

export const TodoList = (props: TodoListPropsType) => {
    const onAllClickHandler = () => props.changeFilter(props.todoListId, 'all')
    const onActiveClickHandler = () => props.changeFilter(props.todoListId, 'active')
    const onCompletedClickHandler = () => props.changeFilter(props.todoListId, 'completed')
    const removeTodoListHandler = () => props.removeTodolist(props.todoListId)
    const changeTodoListTitle = (newTitle: string) => props.changeTodolistTitle(props.todoListId, newTitle)
    const addTask = (title: string) => props.addTask(props.todoListId, title)
    const onChangeStatusHandler = (taskId: string, newValue: boolean) => props.changeTaskStatus(props.todoListId, taskId, newValue)

    return (
        <div>
            <h3><EditableSpan title={props.title} onChange={changeTodoListTitle}/>
                <IconButton onClick={removeTodoListHandler}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul>
                {props.tasks && props.tasks.map(task => {
                        const onRemoveHandler = () => props.removeTask(props.todoListId, task.id)

                        const onChangeTitleHandler = (newValue: string) => {
                            props.changeTaskTitle(props.todoListId, task.id, newValue)
                        }

                        return (
                            <li key={task.id}
                                id={task.id} className={task.isDone ? 'is-done' : ''}>
                                <CheckBox changeTaskStatus={(value: boolean) => onChangeStatusHandler(task.id, value)}
                                          checked={task.isDone}/>

                                <EditableSpan title={task.title}
                                              onChange={onChangeTitleHandler}/>
                                <IconButton onClick={onRemoveHandler}>
                                    <Delete/>
                                </IconButton>
                            </li>
                        )
                    }
                )}
            </ul>
            <div>
                <Button color={'success'} variant={props.filter === 'all' ? 'contained' : 'text'}
                        onClick={onAllClickHandler}>All
                </Button>
                <Button color={'primary'} variant={props.filter === 'active' ? 'contained' : 'text'}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={'secondary'} variant={props.filter === 'completed' ? 'contained' : 'text'}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
}

