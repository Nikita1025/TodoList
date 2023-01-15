import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import { AppThunkType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {AxiosError} from "axios";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state: TasksStateType, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC(state: TasksStateType, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state: TasksStateType, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC(state: TasksStateType, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },

    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach((el) => {
                state[el.id] = []
            })
        })
    }
})

export const tasksReducer = slice.reducer
export const {
    removeTaskAC, addTaskAC, updateTaskAC, setTasksAC

} = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(setTasksAC({tasks, todolistId}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)

    }

}
export const removeTaskTC = (taskId: string, todolistId: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(taskId, todolistId)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(removeTaskAC({taskId, todolistId}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}
export const addTaskTC = (title: string, todolistId: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        console.log(res)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            const action = addTaskAC({task})
            dispatch(action)
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunkType =>
    async (dispatch, getState) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
            if (res.data.resultCode === 0) {
                const action = updateTaskAC({taskId, model: domainModel, todolistId})
                dispatch(action)
            } else {
                handleServerAppError(res.data, dispatch);
            }
        } catch (e) {
            const error = e as Error | AxiosError
            handleServerNetworkError(error, dispatch)
        }
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

