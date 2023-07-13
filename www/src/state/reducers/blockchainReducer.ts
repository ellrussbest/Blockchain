import { Action } from "../actions";
import { ActionType } from "../action-types";

interface BlockchainState {
	walletInfo: {
		address: string | undefined;
		balance: number | undefined;
	};
	blocks: {
		timestamp: string;
		previousBlockHash: string;
		hash: string;
		data: any[];
		nonce: number;
		difficulty: number;
	}[];
}

const initialState: BlockchainState = {
	walletInfo: {
		address: undefined,
		balance: undefined,
	},
	blocks: [],
};

const reducer = (
	state: BlockchainState = initialState,
	action: Action,
): BlockchainState => {
	switch (action.type) {
		case ActionType.UPDATE_BLOCKS:
			return { ...state, blocks: action.payload };
		case ActionType.UPDATE_WALLET_INFO:
			return { ...state, walletInfo: action.payload };
		default:
			return state;
	}
};

export default reducer;
