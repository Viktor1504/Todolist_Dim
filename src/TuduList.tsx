import React, {memo, useCallback} from 'react';
import {FilterValuesType} from './AppWithReducers';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {Task} from './Task';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: TaskType[]
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todoListId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
    filter: FilterValuesType
    removeTodolist: (todolistId: string) => void
}

export const TodoList = memo((props: TodoListPropsType) => {
    console.log('Todolist is called')

    const removeTodoListHandler = () => props.removeTodolist(props.todoListId)
    const changeTodoListTitle = useCallback((newTitle: string) => props.changeTodolistTitle(props.todoListId, newTitle), [props.changeTodolistTitle, props.todoListId])

    const addTask = useCallback((title: string) => props.addTask(props.todoListId, title), [props.addTask, props.todoListId])
    const onChangeStatusHandler = (taskId: string, newValue: boolean) => props.changeTaskStatus(props.todoListId, taskId, newValue)

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todoListId, 'all'), [props.changeFilter, props.todoListId])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todoListId, 'active'), [props.changeFilter, props.todoListId])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todoListId, 'completed'), [props.changeFilter, props.todoListId])

    const getFilteredTasks = (allTasks: TaskType[], newFilterValue: FilterValuesType): TaskType[] => {
        switch (newFilterValue) {
            case 'active':
                return allTasks.filter(t => !t.isDone)
            case 'completed':
                return allTasks.filter(t => t.isDone)
            default:
                return allTasks
        }
    }
    const filteredTasks: TaskType[] = getFilteredTasks(props.tasks, props.filter)

    return (
        <div>
            <h3><EditableSpan title={props.title} onChange={changeTodoListTitle}/>
                <IconButton onClick={removeTodoListHandler}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul>
                {
                    filteredTasks.map(task => <Task
                        key={task.id}
                        todoListId={props.todoListId}
                        task={task}
                        changeTaskStatus={props.changeTaskStatus}
                        changeTaskTitle={props.changeTaskTitle}
                        removeTask={props.removeTask}
                    />)
                }
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
})

