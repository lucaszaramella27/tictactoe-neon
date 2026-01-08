import { create } from "zustand";
import type { Mode, Move, Result, Symbol, User } from "../utils/types";
import { resultOf } from "../utils/game";

type GameState = {
  mode: Mode | null;
  opponent: User | null;
  yourSymbol: Symbol;
  board: Array<Symbol | null>;
  moves: Move[];
  turn: Symbol; // "X" começa
  result: Result | null;

  start: (mode: Mode, yourSymbol: Symbol, opponent: User | null) => void;
  play: (pos: number) => void;
  reset: () => void;
};

function other(s: Symbol): Symbol { return s === "X" ? "O" : "X"; }

export const useGameStore = create<GameState>((set, get) => ({
  mode: null,
  opponent: null,
  yourSymbol: "X",
  board: Array(9).fill(null),
  moves: [],
  turn: "X",
  result: null,

  start: (mode, yourSymbol, opponent) => set({
    mode,
    opponent,
    yourSymbol,
    board: Array(9).fill(null),
    moves: [],
    turn: "X",
    result: null
  }),

  play: (pos) => {
    const s = get();
    if (s.result) return;
    if (s.board[pos]) return;

    const sym = s.turn;
    const nextBoard = s.board.slice();
    nextBoard[pos] = sym;

    const nextMoves = [...s.moves, { symbol: sym, pos }];
    const r = resultOf(nextBoard);

    set({
      board: nextBoard,
      moves: nextMoves,
      turn: other(sym),
      result: r
    });
  },

  reset: () => set({
    mode: null,
    opponent: null,
    yourSymbol: "X",
    board: Array(9).fill(null),
    moves: [],
    turn: "X",
    result: null
  })
}));
