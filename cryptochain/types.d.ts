/** Block interfaces */
interface BlockContent {
  timestamp: string;
  previousBlockHash: string;
  hash: string;
  data: string[];
  nonce: number;
  difficulty: number;
}

interface MinedBlockParams {
  lastBlock: Block;
  data: string[];
}

interface AdjustDifficultyParams {
  originalBlock: Block;
  timestamp: number;
}

/** Blockchain interfaces */
