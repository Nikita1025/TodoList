import {TasksStateType} from "../App";
import {v1} from "uuid";
import {removeTaskAC, taskReduser} from "./task-reduser";

let startState:TasksStateType
let todolistId1 = v1();
let todolistId2 = v1();
beforeEach(()=>{
    startState= {
        [todolistId1]: [
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true}
    ],
        [todolistId2]: [
        {id: v1(), title: "Milk", isDone: true},
        {id: v1(), title: "React Book", isDone: true}
    ]
    }
})
test('correct task should be deleted from correct array', ()=>{
    const action = removeTaskAC('1', todolistId2)
    const endState = taskReduser(startState, action)
    expect(endState).toEqual({
        [todolistId1]: [
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true}
    ],
        [todolistId2]: [
        {id: v1(), title: "Milk", isDone: true},
    ]
    })
})