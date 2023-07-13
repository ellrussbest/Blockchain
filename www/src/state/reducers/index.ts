import { combineReducers } from "redux";
import blockchainReducer from "./blockchainReducer";

const reducers = combineReducers({
	blockchain: blockchainReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
