import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunkType} from "../../app/store";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";


const initialState: Array<TodolistDomainType> = []


const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state: TodolistDomainType[], action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state: TodolistDomainType[], action: PayloadAction<{ todolist: TodolistType }>) {
            state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC(state: TodolistDomainType[], action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state: TodolistDomainType[], action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state: TodolistDomainType[], action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        setTodolistsAC(state: TodolistDomainType[], action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC, addTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, changeTodolistEntityStatusAC,
    setTodolistsAC
} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}
export const removeTodolistTC = (todolistId: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistId)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC({id: todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)

    }
}
export const addTodolistTC = (title: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC({todolist: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)

    }

}
export const changeTodolistTitleTC = (id: string, title: string): AppThunkType => async dispatch => {
    try {
        await todolistsAPI.updateTodolist(id, title)
        dispatch(changeTodolistTitleAC({id, title}))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)

    }
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

