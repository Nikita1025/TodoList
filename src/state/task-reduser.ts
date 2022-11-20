import {TasksStateType} from "../App";
import {v1} from "uuid";
import {addTodolistACAC, removeTodolistACType} from "./todolist-reducer";

let initialState: TasksStateType = {}

export const taskReduser = (state = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.id)}
        case "ADD-TASK":
            let task = {id: v1(), title: action.title, isDone: false};
            return {...state, [action.todolistId]: [task, ...state[action.todolistId]]}
        case "GHANGE-STATUS":
            return {...state, [action.todolistId]:state[action.todolistId].map(el=>el.id === action.id? {...el, isDone: action.isDone}:el)}
        case "GHANGE-TASK":
            return {...state, [action.todolistId]:state[action.todolistId].map(el=>el.id === action.id? {...el, title: action.newTitle}:el)}
        case "REMOVE-TODOLIST":
            let stateCopy={...state}
            delete stateCopy[action.id]
            return stateCopy
        case "ADD-TODOLIST":
            return {...state, [action.todolistId]: []}
        default:
            return state
    }
}
type ActionType = removeTaskACType | addTaskACType | changeStatusACType | changeTaskTitleACType
| removeTodolistACType | addTodolistACAC

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeStatusACType = ReturnType<typeof changeStatusAC>
type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>


export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        id, todolistId
    } as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        title, todolistId
    } as const
}
export const changeStatusAC = (id: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'GHANGE-STATUS',
        id, isDone, todolistId
    } as const
}
export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string) => {
    return {
        type: 'GHANGE-TASK',
        id, newTitle, todolistId
    } as const
}