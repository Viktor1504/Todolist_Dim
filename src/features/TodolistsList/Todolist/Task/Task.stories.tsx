import {action} from '@storybook/addon-actions';
import {Task} from './Task';
import React from 'react';
import {TaskPriorities, TaskStatuses} from '../../../../api/todolists-api'

export default {
    title: 'Task Component',
    component: Task
}

const changeTaskStatusCallback = action('Status Changed')
const changeTaskTitleCallback = action('Title Changed')
const removeTaskCallback = action('Task Removed')


export const TaskBaseExample = () => {
    return <>
        <Task
            todoListId={'todoListId1'}
            task={{
                id: '1',
                status: TaskStatuses.Completed,
                title: 'CSS',
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }}
            changeTaskStatus={changeTaskStatusCallback}
            changeTaskTitle={changeTaskTitleCallback}
            removeTask={removeTaskCallback}
        />
        <Task
            todoListId={'todoListId2'}
            task={{
                id: '2',
                status: TaskStatuses.New,
                title: 'JS',
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: ''
            }}
            changeTaskStatus={changeTaskStatusCallback}
            changeTaskTitle={changeTaskTitleCallback}
            removeTask={removeTaskCallback}
        />
    </>
}