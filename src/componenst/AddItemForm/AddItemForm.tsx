import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from '@mui/material';
import {ControlPoint} from '@mui/icons-material';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}
export const AddItemForm = memo(({addItem, disabled = false}: AddItemFormPropsType) => {
    console.log('AddItemForm is called')
    const [newTaskTitle, setTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.key === 'Enter' && newTaskTitle.trim() !== '') {
            addItem(newTaskTitle)
            setTitle('')
        }
    }
    const addItemHandler = () => {
        if (newTaskTitle.trim() !== '') {
            addItem(newTaskTitle.trim())
            setTitle('')
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
                       disabled={disabled}
            />
            <IconButton onClick={addItemHandler} color={'primary'} disabled={disabled}>
                <ControlPoint/>
            </IconButton>
        </div>
    )
})