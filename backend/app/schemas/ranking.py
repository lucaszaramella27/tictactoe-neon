from __future__ import annotations

import uuid
from pydantic import BaseModel


class RankingRow(BaseModel):
    user_id: uuid.UUID
    display_name: str
    points: int
    wins: int
    losses: int
    draws: int
    games_played: int
