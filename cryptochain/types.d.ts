/** Block interfaces */
interface BlockContent {
  timestamp: string;
  previousBlockHash: string;
  hash: string;
  data: any[];
  nonce: number;
  difficulty: number;
}

interface BlockToBeMinedParameters {
  lastBlock: Block;
  data: any[];
}

interface AdjustDifficultyParams {
  lastBlock: Block;
  timestamp: number;
}

/** Blockchain interfaces */
