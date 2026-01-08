from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.db import get_session
from app.models.ranking import Ranking
from app.models.user import User
from app.schemas.ranking import RankingRow

router = APIRouter(prefix="/ranking", tags=["ranking"])


@router.get("/top", response_model=list[RankingRow])
async def top(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(Ranking, User)
        .join(User, User.id == Ranking.user_id)
        .order_by(desc(Ranking.points), desc(Ranking.wins), desc(Ranking.games_played))
        .limit(20)
    )
    rows = (await session.execute(stmt)).all()

    out: list[RankingRow] = []
    for r, u in rows:
        out.append(
            RankingRow(
                user_id=u.id,
                display_name=u.display_name,
                points=r.points,
                wins=r.wins,
                losses=r.losses,
                draws=r.draws,
                games_played=r.games_played,
            )
        )
    return out
