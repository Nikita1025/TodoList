import {combineReducers, legacy_createStore} from 'redux';
import {todolistReducer} from "./todolist-reducer";
import {taskReduser} from "./task-reduser";

const rootReducer = combineReducers({
    tasks: taskReduser,
    todolists: todolistReducer
})
export const store = legacy_createStore(rootReducer);

export type AppRootStateType = ReturnType<typeof rootReducer>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
