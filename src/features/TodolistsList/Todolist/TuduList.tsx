import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../componenst/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../componenst/EditableSpan/EditableSpan';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolists-api';
import {fetchTodolistsTC, FilterValuesType} from '../todolists-reducer';
import {useDispatch} from 'react-redux';
import {fetchTasksTC} from '../tasks-reducer';

type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: TaskType[]
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todoListId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
    filter: FilterValuesType
    removeTodolist: (todolistId: string) => void
}

export const TodoList = memo((props: TodoListPropsType) => {
    console.log('Todolist is called')

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTasksTC(props.todoListId))
    }, [])

    const removeTodoListHandler = () => props.removeTodolist(props.todoListId)
    const changeTodoListTitle = useCallback((newTitle: string) => props.changeTodolistTitle(props.todoListId, newTitle), [props.changeTodolistTitle, props.todoListId])

    const addTask = useCallback((title: string) => props.addTask(props.todoListId, title), [props.addTask, props.todoListId])
    const onChangeStatusHandler = (taskId: string, newValue: TaskStatuses) => props.changeTaskStatus(props.todoListId, taskId, newValue)

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todoListId, 'all'), [props.changeFilter, props.todoListId])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todoListId, 'active'), [props.changeFilter, props.todoListId])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todoListId, 'completed'), [props.changeFilter, props.todoListId])

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

                <MyButton color={'success'} variant={props.filter === 'all' ? 'contained' : 'text'}
                          onClick={onAllClickHandler} name={'All'}/>
                <MyButton color={'primary'} variant={props.filter === 'active' ? 'contained' : 'text'}
                          onClick={onActiveClickHandler} name={'Active'}/>
                <MyButton color={'secondary'} variant={props.filter === 'completed' ? 'contained' : 'text'}
                          onClick={onCompletedClickHandler} name={'Completed'}/>

                {/*<Button color={'success'} variant={props.filter === 'all' ? 'contained' : 'text'}*/}
                {/*        onClick={onAllClickHandler}>All*/}
                {/*</Button>*/}
                {/*<Button color={'primary'} variant={props.filter === 'active' ? 'contained' : 'text'}*/}
                {/*        onClick={onActiveClickHandler}>Active*/}
                {/*</Button>*/}
                {/*<Button color={'secondary'} variant={props.filter === 'completed' ? 'contained' : 'text'}*/}
                {/*        onClick={onCompletedClickHandler}>Completed*/}
                {/*</Button>*/}
            </div>
        </div>
    )
})

type MyButtonPropsType = {
    color: 'success' | 'primary' | 'secondary'
    variant: 'contained' | 'text'
    name: string
    onClick: () => void
}

export const MyButton = memo((props: MyButtonPropsType) => {
    return <Button color={props.color} variant={props.variant} onClick={props.onClick}>{props.name}</Button>
})