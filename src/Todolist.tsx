import React, {ChangeEvent, FC, useCallback} from 'react';
import {TodolistType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/task-reduser";
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolist-reducer";
import {TaskRedux} from "./Task.redux";
import {ButtonWithMemo} from "./ButtonMemo";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export const Todolist: FC<PropsType> = ({todolist}) => {
    const {id, filter, title} = todolist
    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id])
    const dispatch = useDispatch();
    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, id))
    },[dispatch, id])

    const removeTodolist = useCallback( () => {
        dispatch(removeTodolistAC(id))
    },[dispatch, id])
    const changeTodolistTitle = useCallback( (title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    },[dispatch, id])

    const onAllClickHandler = useCallback(() => dispatch(changeFilterAC("all", id)),[dispatch, id])
    const onActiveClickHandler = useCallback(() => dispatch(changeFilterAC("active", id)),[dispatch, id])
    const onCompletedClickHandler = useCallback(() => dispatch(changeFilterAC("completed", id)),[dispatch, id])
    if (filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }
    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks?.map(t => {
                    return <TaskRedux
                            key={t.id}
                            task={t}
                            todolistId={id}
                    />
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <ButtonWithMemo
                variant={filter === 'all' ? 'outlined' : 'text'}
                onClick={onAllClickHandler}
                color={'inherit'}
                title={'All'}
            />
            <ButtonWithMemo
                variant={filter === 'active' ? 'outlined' : 'text'}
                onClick={onActiveClickHandler}
                color={'primary'}
                title={'Active'}
            />
            <ButtonWithMemo
                variant={filter === 'completed' ? 'outlined' : 'text'}
                onClick={onCompletedClickHandler}
                color={'secondary'}
                title={'Completed'}
            />
        </div>
    </div>
}


