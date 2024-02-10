import CheckBox from './componenst/CheckBox';
import {EditableSpan} from './EditableSpan';
import {IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import React, {memo, useCallback} from 'react';
import {TaskStatuses, TaskType} from './api/todolists-api';

type TaskPropsType = {
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    task: TaskType
    todoListId: string
}
export const Task = memo((props: TaskPropsType) => {
    const onRemoveHandler = () => props.removeTask(props.todoListId, props.task.id)

    const onChangeTitleHandler = useCallback((newValue: string) => props.changeTaskTitle(props.todoListId, props.task.id, newValue), [props.changeTaskTitle, props.todoListId, props.task.id])


    const onChangeStatusHandler = (taskId: string, newValue: boolean) => props.changeTaskStatus(props.todoListId, taskId, newValue ? TaskStatuses.Completed : TaskStatuses.New)

    return (
        <div key={props.task.id}
             id={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <CheckBox changeTaskStatus={(value: boolean) => onChangeStatusHandler(props.task.id, value)}
                      checked={props.task.status === TaskStatuses.Completed}/>

            <EditableSpan title={props.task.title}
                          onChange={onChangeTitleHandler}/>
            <IconButton onClick={onRemoveHandler}>
                <Delete/>
            </IconButton>
        </div>
    )
})