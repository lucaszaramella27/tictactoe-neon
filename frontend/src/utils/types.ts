export type Mode = "PVP" | "PVC";
export type Symbol = "X" | "O";
export type Result = "X" | "O" | "DRAW";

export type Move = { symbol: Symbol; pos: number };

export type User = {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
};

export type RankingRow = {
  user_id: string;
  display_name: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  games_played: number;
};
