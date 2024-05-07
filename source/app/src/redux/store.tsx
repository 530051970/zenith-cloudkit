import { createStore } from 'redux'
import { sourceReducer } from "./source/sourceReducer"

const store = createStore(sourceReducer)

export type RootState = ReturnType<typeof store.getState>

export default store;