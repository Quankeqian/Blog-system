import { legacy_createStore as createStore, combineReducers } from "redux";
import { Collapsedreducer } from './reducers/Collapsedreducer'
import { LoadingReducer } from './reducers/LoadingReducer'
const reducer = combineReducers({
    Collapsedreducer,
    LoadingReducer
})
const store = createStore(reducer)
export default store