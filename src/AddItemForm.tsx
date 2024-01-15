import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from '@mui/material';
import {ControlPoint} from '@mui/icons-material';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}
export const AddItemForm = memo((props: AddItemFormPropsType) => {
    console.log('AddItemForm is called')
    const [newTaskTitle, setNewTaskTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.key === 'Enter' && newTaskTitle.trim() !== '') {
            props.addItem(newTaskTitle)
            setNewTaskTitle('')
        }
    }
    const addTask = () => {
        if (newTaskTitle.trim() !== '') {
            props.addItem(newTaskTitle.trim())
            setNewTaskTitle('')
        } else {
            setError('Title is required')
        }
    }

    return (
        <div>
            <TextField value={newTaskTitle}
                       variant={'outlined'}
                       label={'Type value'}
                       onChange={onNewTitleChangeHandler}
                       onKeyDown={onKeyDownHandler}
                       error={!!error}
                       helperText={error}
            />
            <IconButton onClick={addTask} color={'primary'}>
                <ControlPoint/>
            </IconButton>
        </div>
    )
})