import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../componenst/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../componenst/EditableSpan/EditableSpan';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolists-api';
import {fetchTodolistsTC, FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import {useDispatch} from 'react-redux';
import {fetchTasksTC} from '../tasks-reducer';
import {useAppDispatch} from '../../../app/store';

type TodoListPropsType = {
    todolist: TodolistDomainType
    tasks: TaskType[]
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todoListId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
    removeTodolist: (todolistId: string) => void
    demo?: boolean
}

export const TodoList = memo(({demo = false, ...props}: TodoListPropsType) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) return
        dispatch(fetchTasksTC(props.todolist.id))
    }, [])

    const removeTodoList = () => props.removeTodolist(props.todolist.id)
    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodolistTitle(props.todolist.id, newTitle)
    }, [props.changeTodolistTitle, props.todolist.id])

    const addTask = useCallback((title: string) => {
        props.addTask(props.todolist.id, title)
    }, [props.addTask, props.todolist.id])

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolist.id, 'all'), [props.changeFilter, props.todolist.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolist.id, 'active'), [props.changeFilter, props.todolist.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todolist.id, 'completed'), [props.changeFilter, props.todolist.id])

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
    const filteredTasks: TaskType[] = getFilteredTasks(props.tasks, props.todolist.filter)

    return (
        <div>
            <h3><EditableSpan title={props.todolist.title} onChange={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
            <div>
                {
                    filteredTasks && filteredTasks.map(task => <Task
                        key={task.id}
                        todoListId={props.todolist.id}
                        task={task}
                        changeTaskStatus={props.changeTaskStatus}
                        changeTaskTitle={props.changeTaskTitle}
                        removeTask={props.removeTask}
                    />)
                }
            </div>
            <div>
                <Button color={'success'} variant={props.todolist.filter === 'all' ? 'contained' : 'text'}
                        onClick={onAllClickHandler}>All
                </Button>
                <Button color={'primary'} variant={props.todolist.filter === 'active' ? 'contained' : 'text'}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={'secondary'} variant={props.todolist.filter === 'completed' ? 'contained' : 'text'}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
})