/** Block interfaces */
interface BlockContent {
  timestamp: string;
  previousBlockHash: string;
  hash: string;
  data: any[];
  nonce: number;
  difficulty: number;
}

interface MinedBlockParams {
  lastBlock: Block;
  data: any[];
}

interface AdjustDifficultyParams {
  originalBlock: Block;
  timestamp: number;
}

/** Blockchain interfaces */
