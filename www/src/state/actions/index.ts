import { ActionType } from "../action-types";

export interface UpdateBlocksAction {
	type: ActionType.UPDATE_BLOCKS;
	payload: {
		timestamp: string;
		previousBlockHash: string;
		hash: string;
		data: any[];
		nonce: number;
		difficulty: number;
	}[];
}

export interface UpdateWalletInfoAction {
	type: ActionType.UPDATE_WALLET_INFO;
	payload: {
		address: string;
		balance: number;
	};
}

export type Action = UpdateBlocksAction | UpdateWalletInfoAction;
