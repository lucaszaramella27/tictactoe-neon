import type { Symbol, Result } from "./types";

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const satisfies ReadonlyArray<readonly [number, number, number]>;

export function winner(board: ReadonlyArray<Symbol | null>): Symbol | null {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

export function resultOf(board: ReadonlyArray<Symbol | null>): Result | null {
  const w = winner(board);
  if (w) return w;
  if (board.every(Boolean)) return "DRAW";
  return null;
}
