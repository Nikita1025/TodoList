import React, {ChangeEvent, useState} from 'react';
type SuperSpanType={
    value: string
    onChange: (newValue: string)=>void
}
export const SuperSpan = (props:SuperSpanType) => {
    let [editMode, setEditMode] = useState(false)
    let [title, setTitle]= useState(props.value)
    const onChangeHandler=(e: ChangeEvent<HTMLInputElement>)=>{
        setTitle(e.currentTarget.value)
    }
    const onBlurHandler=()=>{
        setEditMode(false)
        props.onChange(title)
    }
    const DoubleClickHandler=()=>{
        setEditMode(true)
        setTitle(props.value)
    }
    return editMode
        ? <input value={title} onChange={onChangeHandler} autoFocus onBlur={onBlurHandler}/>
        : <span onDoubleClick={DoubleClickHandler}>{props.value}</span>
};

