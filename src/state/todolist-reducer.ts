import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

let initialState: TodolistType[] = []


export const todolistReducer = (state = initialState, action: ActionType): TodolistType[] => {
    switch (action.type) {
        case "CHANGE-FILTER":
            return state.map(el=> el.id === action.todolistId ? {...el, filter: action.value}:el)
        case "REMOVE-TODOLIST":
            return state.filter(el=> el.id !== action.id)
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el=> el.id === action.id ? {...el, title: action.title}:el)
        case "ADD-TODOLIST":
            let newTodolist: TodolistType = {id: action.todolistId, title: action.title, filter: 'all'};
            return [...state, newTodolist]
        default:
            return state
    }
}


type ActionType = changeFilterACType
    | removeTodolistACType | changeTodolistTitleAC | addTodolistACAC

type changeFilterACType = ReturnType<typeof changeFilterAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export type changeTodolistTitleAC = ReturnType<typeof changeTodolistTitleAC>
export type addTodolistACAC = ReturnType<typeof addTodolistAC>


export const changeFilterAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: 'CHANGE-FILTER',
        value, todolistId
    } as const
}
export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        id
    } as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        id, title
    } as const
}
export const addTodolistAC = ( title: string) => {
    return {
        type: 'ADD-TODOLIST',
         title, todolistId: v1()
    } as const
}