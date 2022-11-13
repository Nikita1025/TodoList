import React, {ChangeEvent} from 'react';
type CheckBoxType ={
    checked: boolean
    callback: (eValue: boolean)=>void
}
export const CheckBox = (props: CheckBoxType) => {
    const onChangeHandler=(e:ChangeEvent<HTMLInputElement>)=>{
        props.callback(e.currentTarget.checked)
    }

    return (

        <input type="checkbox" onChange={onChangeHandler} checked={props.checked}/>

    );
}
