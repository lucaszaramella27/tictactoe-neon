from __future__ import annotations

import json
import os
from pathlib import Path
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Carregar backend/.env com certeza (mesmo que você rode o uvicorn de outra pasta)
try:
    from dotenv import load_dotenv  # pip install python-dotenv
    env_path = Path(__file__).resolve().parents[1] / ".env"  # backend/.env
    load_dotenv(env_path)
except Exception:
    # Se não tiver python-dotenv instalado, só ignora e usa variáveis do ambiente
    pass

from app.routers import auth_router, users_router, matches_router, ranking_router  # noqa: E402


def parse_origins() -> List[str]:
    raw = (os.getenv("CORS_ORIGINS") or "").strip()

    defaults = ["http://localhost:5173", "http://127.0.0.1:5173"]
    if not raw:
        return defaults

    # 1) JSON list: ["http://...","http://..."]
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            out = [str(x).strip() for x in parsed if str(x).strip()]
            return out or defaults
        if isinstance(parsed, str) and parsed.strip():
            return [parsed.strip()]
    except Exception:
        pass

    # 2) CSV: http://...,http://...
    if "," in raw:
        out = [p.strip() for p in raw.split(",") if p.strip()]
        return out or defaults

    # 3) String única
    return [raw]


app = FastAPI(title="TicTacToe Neon API", version="1.0.0")

origins = parse_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(matches_router)
app.include_router(ranking_router)


@app.get("/health")
async def health():
    return {"ok": True, "origins": origins}
