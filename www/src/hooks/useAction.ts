import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import { useCallback } from "react";

export const useActions = () => {
	const dispatch = useDispatch();

	return bindActionCreators(actionCreators, dispatch);
};
