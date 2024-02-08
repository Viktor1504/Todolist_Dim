import {action} from '@storybook/addon-actions';
import {Task} from './Task';
import React from 'react';

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
            task={{id: '1', isDone: true, title: 'CSS'}}
            changeTaskStatus={changeTaskStatusCallback}
            changeTaskTitle={changeTaskTitleCallback}
            removeTask={removeTaskCallback}
        />
        <Task
            todoListId={'todoListId2'}
            task={{id: '2', isDone: false, title: 'JS'}}
            changeTaskStatus={changeTaskStatusCallback}
            changeTaskTitle={changeTaskTitleCallback}
            removeTask={removeTaskCallback}
        />
    </>
}