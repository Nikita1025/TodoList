import {combineReducers, compose, legacy_createStore} from 'redux';
import {todolistReducer} from "./todolist-reducer";
import {taskReduser} from "./task-reduser";
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}


const rootReducer = combineReducers({
    tasks: taskReduser,
    todolists: todolistReducer
})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, composeEnhancers());

export type AppRootStateType = ReturnType<typeof rootReducer>
