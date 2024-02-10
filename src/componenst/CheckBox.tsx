import React, {ChangeEvent} from 'react';
import {Checkbox} from '@mui/material';
import {TaskStatuses} from '../api/todolists-api';

type CheckBoxType = {
    changeTaskStatus: (value: boolean) => void
    checked: boolean
}

const CheckBox = (props: CheckBoxType) => {

    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(e.currentTarget.checked)
    }

    return (
        <Checkbox
            checked={props.checked}
            onChange={onChangeStatusHandler}
            color={'primary'}
        />
    );
};

export default CheckBox;