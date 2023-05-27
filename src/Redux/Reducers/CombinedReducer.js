import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import stationDataReducer from "./StationDataReducer";

const combinedReducer = combineReducers({
    authReducer,
    stationDataReducer,
    
})

export default combinedReducer;