from __future__ import annotations

import uuid
from typing import Literal
from pydantic import BaseModel, Field

Mode = Literal["PVP", "PVC"]
Symbol = Literal["X", "O"]
Result = Literal["X", "O", "DRAW"]


class Move(BaseModel):
    symbol: Symbol
    pos: int = Field(ge=0, le=8)


class MatchCreateIn(BaseModel):
    mode: Mode
    your_symbol: Symbol = Field(description="Símbolo do usuário autenticado")
    opponent_id: uuid.UUID | None = Field(default=None, description="Obrigatório no PVP")
    moves: list[Move]
    declared_result: Result


class MatchOut(BaseModel):
    id: uuid.UUID
    mode: Mode
    player_x_id: uuid.UUID | None
    player_o_id: uuid.UUID | None
    human_id: uuid.UUID | None
    human_symbol: Symbol | None
    moves: list[Move]
    declared_result: Result
    validated_result: Result

    class Config:
        from_attributes = True
