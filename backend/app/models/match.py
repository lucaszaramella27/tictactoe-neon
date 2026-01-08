from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Literal

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy import Uuid
from sqlalchemy.orm import Mapped, mapped_column

from sqlalchemy.types import JSON

from app.models.base import Base

MatchMode = Literal["PVP", "PVC"]
MatchResult = Literal["X", "O", "DRAW"]


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

    mode: Mapped[str] = mapped_column(String(3), nullable=False)  # "PVP" | "PVC"
    player_x_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    player_o_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Para PVC, quem é o humano e qual símbolo ele usa:
    human_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    human_symbol: Mapped[str | None] = mapped_column(String(1), nullable=True)  # "X" | "O"

    # movimentos: lista de objetos { "symbol": "X"|"O", "pos": 0..8 }
    moves: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False, default=list)

    declared_result: Mapped[str] = mapped_column(String(4), nullable=False)  # "X"|"O"|"DRAW"
    validated_result: Mapped[str] = mapped_column(String(4), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
