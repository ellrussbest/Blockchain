/** Block interfaces */
export interface BlockContent {
  timestamp: string;
  previousBlockHash: string;
  hash: string;
  data: any[];
  nonce: number;
  difficulty: number;
}

export interface BlockToBeMinedParameters {
  lastBlock: Block;
  data: any[];
}

export interface AdjustDifficultyParams {
  lastBlock: Block;
  timestamp: number;
}

/** Blockchain interfaces */
