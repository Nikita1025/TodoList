import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
type AddItemForn={
    addItem:(title:string)=>void
}
export const AddItemForn = (props:AddItemForn) => {
    let [error, setError] = useState<string | null>(null)
    let [title, setTitle] = useState('')
    const addTask = () => {
        let newTitle = title.trim()
        if (newTitle !== "") {
            props.addItem(title)
            setTitle('')
        } else {
            setError("Title is required")
        }
    }
    const onChangeHandker = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)

    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            addTask()
        }
    }
    return (
        <div>
            <input value={title}
                   onChange={onChangeHandker}
                   onKeyPress={onKeyPressHandler}
                   className={error ? "error" : ""}
            />
            <button onClick={addTask}>+</button>
            {error && <div className={'error-message'}>{error}</div>}
        </div>
    );
};