import type { Symbol } from "../utils/types";
import { Cell } from "./Cell";

export function Board({
  board,
  onPlay,
  locked
}: {
  board: Array<Symbol | null>;
  onPlay: (pos: number) => void;
  locked: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {board.map((v, i) => (
        <Cell key={i} value={v} index={i} disabled={locked || !!v} onClick={() => onPlay(i)} />
      ))}
    </div>
  );
}
