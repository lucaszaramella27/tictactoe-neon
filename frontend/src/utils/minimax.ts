import type { Symbol } from "./types";
import { winner } from "./game";

function other(s: Symbol): Symbol { return s === "X" ? "O" : "X"; }

function scoreTerminal(board: Array<Symbol | null>, ai: Symbol): number | null {
  const w = winner(board);
  if (w === ai) return 10;
  if (w && w !== ai) return -10;
  if (board.every(Boolean)) return 0;
  return null;
}

function minimax(board: Array<Symbol | null>, turn: Symbol, ai: Symbol, depth: number): number {
  const terminal = scoreTerminal(board, ai);
  if (terminal !== null) return terminal - depth; // prefer vitórias rápidas

  const moves: number[] = [];
  for (let i=0;i<9;i++) if (!board[i]) moves.push(i);

  if (turn === ai) {
    let best = -Infinity;
    for (const m of moves) {
      board[m] = turn;
      best = Math.max(best, minimax(board, other(turn), ai, depth+1));
      board[m] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      board[m] = turn;
      best = Math.min(best, minimax(board, other(turn), ai, depth+1));
      board[m] = null;
    }
    return best;
  }
}

export function bestMove(board: Array<Symbol | null>, ai: Symbol, turn: Symbol): number {
  let bestScore = -Infinity;
  let bestPos = -1;
  for (let i=0;i<9;i++) {
    if (board[i]) continue;
    board[i] = turn;
    const s = minimax(board, other(turn), ai, 0);
    board[i] = null;
    if (s > bestScore) {
      bestScore = s;
      bestPos = i;
    }
  }
  return bestPos;
}
