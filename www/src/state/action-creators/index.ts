import { ActionType } from "../action-types";
import { UpdateWalletInfoAction, UpdateBlocksAction } from "../actions";

// update wallet info
export const updateWalletInfo = (payload: {
	address: string;
	balance: number;
}): UpdateWalletInfoAction => {
	return {
		type: ActionType.UPDATE_WALLET_INFO,
		payload,
	};
};

// update blocks
export const updateBlocks = (
	payload: {
		timestamp: string;
		previousBlockHash: string;
		hash: string;
		data: any[];
		nonce: number;
		difficulty: number;
	}[],
): UpdateBlocksAction => {
	return {
		type: ActionType.UPDATE_BLOCKS,
		payload,
	};
};
