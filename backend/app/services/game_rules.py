from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

Symbol = Literal["X", "O"]
Result = Literal["X", "O", "DRAW", "ONGOING"]

WIN_LINES = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]


@dataclass(frozen=True)
class ValidatedGame:
    validated_result: Literal["X", "O", "DRAW"]
    winner: Symbol | None
    is_draw: bool


def _winner(board: list[str | None]) -> Symbol | None:
    for a, b, c in WIN_LINES:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]  # type: ignore[return-value]
    return None


def validate_moves(moves: list[dict], *, starting_symbol: Symbol = "X") -> ValidatedGame:
    if not (0 <= len(moves) <= 9):
        raise ValueError("Número de jogadas inválido.")

    board: list[str | None] = [None] * 9
    expected: Symbol = starting_symbol

    seen = set()

    for idx, m in enumerate(moves):
        sym = m.get("symbol")
        pos = m.get("pos")

        if sym not in ("X", "O"):
            raise ValueError(f"Jogada {idx}: símbolo inválido.")
        if sym != expected:
            raise ValueError(f"Jogada {idx}: vez inválida. Esperado '{expected}'.")
        if not isinstance(pos, int) or pos < 0 or pos > 8:
            raise ValueError(f"Jogada {idx}: posição inválida.")
        if pos in seen:
            raise ValueError(f"Jogada {idx}: posição repetida.")
        if board[pos] is not None:
            raise ValueError(f"Jogada {idx}: célula já ocupada.")

        board[pos] = sym
        seen.add(pos)

        w = _winner(board)
        if w is not None:
            # não pode haver jogadas após o fim
            if idx != len(moves) - 1:
                raise ValueError("Partida contém jogadas após o término (vitória já definida).")
            return ValidatedGame(validated_result=w, winner=w, is_draw=False)

        expected = "O" if expected == "X" else "X"

    # terminou sem vencedor
    if len(moves) == 9:
        return ValidatedGame(validated_result="DRAW", winner=None, is_draw=True)

    # Se o cliente tentou salvar antes de finalizar, bloqueia para ranking consistente
    raise ValueError("Partida ainda está em andamento. Finalize antes de salvar.")
