import {Dispatch} from "redux";
import {authAPI, AuthStatuses} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ResponseType} from '../api/todolists-api'

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}
const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppErrorAC(state: InitialStateType, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state: InitialStateType, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setIsInitialized(state: InitialStateType, action: PayloadAction<{ value: boolean }>) {
            state.isInitialized = action.payload.value
        }
    }
})

export const appReducer = slice.reducer
export const setAppErrorAC = slice.actions.setAppErrorAC
export const setAppStatusAC = slice.actions.setAppStatusAC
export const setIsInitialized = slice.actions.setIsInitialized


export const meTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === AuthStatuses.Ok) {

                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(setIsLoggedInAC({value: true}))

            } else {

                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitialized({value: true}))
        })
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized: boolean
}