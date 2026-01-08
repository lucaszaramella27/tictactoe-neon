# Tic-Tac-Toe Neon (Monorepo)

Jogo da Velha futurista (neon + glassmorphism), com:
- PVP local (pass-and-play no mesmo navegador; seleciona o oponente cadastrado)
- PVC (IA Minimax no frontend)
- Backend valida partidas (reprocessa jogadas e confirma vencedor/empate)
- Auth OAuth2 Bearer JWT, rotas protegidas
- Postgres + Alembic + SQLAlchemy async
- Ranking com pontuação e estatísticas

## Regras de pontuação
- Vitória: +3
- Empate: +1
- Derrota: +0
No PVC: apenas o humano entra no ranking (CPU não pontua).

> Observação: por ser PVP local (sem WebSocket e sem confirmação do oponente), o backend garante consistência do jogo (movimentos e resultado),
mas não impede que alguém "jogue contra si mesmo" para farmar pontos. Se você quiser anti-fraude, adicione confirmação do oponente ou assinatura.

---

## 1) Subir Postgres (Docker)
Na raiz do monorepo:

```bash
docker compose up -d
