from __future__ import annotations

import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.ranking import Ranking

WIN_POINTS = 3
DRAW_POINTS = 1
LOSS_POINTS = 0


async def _get_or_create(session: AsyncSession, user_id: uuid.UUID) -> Ranking:
    row = (await session.execute(select(Ranking).where(Ranking.user_id == user_id))).scalar_one_or_none()
    if row:
        return row
    row = Ranking(user_id=user_id)
    session.add(row)
    await session.flush()
    return row


async def apply_result_pvp(
    session: AsyncSession,
    *,
    player_x_id: uuid.UUID,
    player_o_id: uuid.UUID,
    validated_result: str,  # "X"|"O"|"DRAW"
) -> None:
    rx = await _get_or_create(session, player_x_id)
    ro = await _get_or_create(session, player_o_id)

    rx.games_played += 1
    ro.games_played += 1

    if validated_result == "DRAW":
        rx.draws += 1
        ro.draws += 1
        rx.points += DRAW_POINTS
        ro.points += DRAW_POINTS
        return

    if validated_result == "X":
        rx.wins += 1
        ro.losses += 1
        rx.points += WIN_POINTS
        ro.points += LOSS_POINTS
        return

    if validated_result == "O":
        ro.wins += 1
        rx.losses += 1
        ro.points += WIN_POINTS
        rx.points += LOSS_POINTS
        return

    raise ValueError("validated_result inválido.")


async def apply_result_pvc(
    session: AsyncSession,
    *,
    human_id: uuid.UUID,
    human_symbol: str,      # "X"|"O"
    validated_result: str,  # "X"|"O"|"DRAW"
) -> None:
    rh = await _get_or_create(session, human_id)
    rh.games_played += 1

    if validated_result == "DRAW":
        rh.draws += 1
        rh.points += DRAW_POINTS
        return

    if validated_result == human_symbol:
        rh.wins += 1
        rh.points += WIN_POINTS
        return

    # computador venceu
    rh.losses += 1
    rh.points += LOSS_POINTS
