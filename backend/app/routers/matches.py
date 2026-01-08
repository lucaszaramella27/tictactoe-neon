from __future__ import annotations

import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_session
from app.models.user import User
from app.models.match import Match
from app.schemas.match import MatchCreateIn, MatchOut
from app.routers.auth import get_current_user
from app.services.game_rules import validate_moves
from app.services.scoring import apply_result_pvp, apply_result_pvc

router = APIRouter(prefix="/matches", tags=["matches"])


@router.post("", response_model=MatchOut, status_code=201)
async def create_match(
    payload: MatchCreateIn,
    session: AsyncSession = Depends(get_session),
    current: User = Depends(get_current_user),
):
    # 1) valida movimentos e resultado
    try:
        validated = validate_moves([m.model_dump() for m in payload.moves], starting_symbol="X")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if validated.validated_result != payload.declared_result:
        raise HTTPException(status_code=422, detail="Resultado declarado não confere com a validação do servidor.")

    # 2) monta players conforme modo
    mode = payload.mode

    if mode == "PVP":
        if not payload.opponent_id:
            raise HTTPException(status_code=422, detail="opponent_id é obrigatório no modo PVP.")

        if payload.opponent_id == current.id:
            raise HTTPException(status_code=422, detail="Escolha um oponente diferente.")

        opponent = (await session.execute(select(User).where(User.id == payload.opponent_id))).scalar_one_or_none()
        if not opponent:
            raise HTTPException(status_code=404, detail="Oponente não encontrado.")

        if payload.your_symbol == "X":
            player_x_id = current.id
            player_o_id = opponent.id
        else:
            player_x_id = opponent.id
            player_o_id = current.id

        match = Match(
            mode="PVP",
            player_x_id=player_x_id,
            player_o_id=player_o_id,
            human_id=None,
            human_symbol=None,
            moves=[m.model_dump() for m in payload.moves],
            declared_result=payload.declared_result,
            validated_result=validated.validated_result,
        )
        session.add(match)

        # 3) atualiza ranking (PVP: ambos)
        await apply_result_pvp(
            session,
            player_x_id=player_x_id,
            player_o_id=player_o_id,
            validated_result=validated.validated_result,
        )

        await session.commit()
        await session.refresh(match)
        return match

    if mode == "PVC":
        # opponent não participa do ranking
        human_id = current.id
        human_symbol = payload.your_symbol

        match = Match(
            mode="PVC",
            player_x_id=current.id if human_symbol == "X" else None,
            player_o_id=current.id if human_symbol == "O" else None,
            human_id=human_id,
            human_symbol=human_symbol,
            moves=[m.model_dump() for m in payload.moves],
            declared_result=payload.declared_result,
            validated_result=validated.validated_result,
        )
        session.add(match)

        await apply_result_pvc(
            session,
            human_id=human_id,
            human_symbol=human_symbol,
            validated_result=validated.validated_result,
        )

        await session.commit()
        await session.refresh(match)
        return match

    raise HTTPException(status_code=422, detail="Modo inválido.")
