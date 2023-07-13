import { combineReducers } from "redux";

// import each reducer here

const reducers = combineReducers({
	// add each reducer here e.g.
	// fetch: fetchReducer
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
