import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NeonCard } from "../components/NeonCard";
import { NeonButton } from "../components/NeonButton";
import { Board } from "../components/Board";
import { Modal } from "../components/Modal";
import { useAuthStore } from "../stores/authStore";
import { useGameStore } from "../stores/gameStore";
import { useUIStore } from "../stores/uiStore";
import { bestMove } from "../utils/minimax";
import type { Result, Symbol } from "../utils/types";
import * as api from "../lib/api";

function other(s: Symbol): Symbol {
  return s === "X" ? "O" : "X";
}

export function GamePage() {
  const nav = useNavigate();
  const auth = useAuthStore();
  const ui = useUIStore();
  const game = useGameStore();

  const [saving, setSaving] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);

  const mode = game.mode;

  useEffect(() => {
    if (!auth.token) nav("/");
    if (!mode) nav("/lobby");
  }, [auth.token, mode, nav]);

  const isPVC = mode === "PVC";
  const aiSymbol: Symbol = useMemo(() => other(game.yourSymbol), [game.yourSymbol]);

  const isYourTurnInPVC = isPVC && game.turn === game.yourSymbol && !game.result;
  const isAiTurnInPVC = isPVC && game.turn === aiSymbol && !game.result;

  // abre modal quando termina a partida
  useEffect(() => {
    if (game.result) setEndModalOpen(true);
  }, [game.result]);

  // IA joga automaticamente no PVC
  useEffect(() => {
    if (!isAiTurnInPVC) return;
    const t = window.setTimeout(() => {
      const pos = bestMove(game.board.slice(), aiSymbol, aiSymbol);
      if (pos >= 0) game.play(pos);
    }, 350);
    return () => window.clearTimeout(t);
  }, [isAiTurnInPVC, aiSymbol, game]);

  const header = useMemo(() => {
    if (mode === "PVP")
      return `PVP Local — Você: ${game.yourSymbol} | Oponente: ${game.opponent?.display_name ?? "—"}`;
    return `PVC Minimax — Você: ${game.yourSymbol} | CPU: ${aiSymbol}`;
  }, [mode, game.yourSymbol, game.opponent, aiSymbol]);

  const status = useMemo(() => {
    if (!game.result) return `Vez de: ${game.turn}`;
    if (game.result === "DRAW") return "Empate.";
    return `Vitória: ${game.result}`;
  }, [game.result, game.turn]);

  const locked = !!game.result || (isPVC && !isYourTurnInPVC);

  function onPlay(pos: number) {
    game.play(pos);
  }

  async function save() {
    if (!auth.token || !mode || !game.result) return;
    try {
      setSaving(true);
      const payload = {
        mode,
        your_symbol: game.yourSymbol,
        opponent_id: mode === "PVP" ? game.opponent?.id ?? null : null,
        moves: game.moves,
        declared_result: game.result as Result,
      };
      await api.saveMatch(auth.token, payload);
      ui.push({ type: "success", message: "Partida salva e ranking atualizado." });
    } catch (err) {
      ui.push({ type: "error", message: err instanceof Error ? err.message : "Falha ao salvar." });
      throw err; // pra quem chamou poder decidir se fecha ou não
    } finally {
      setSaving(false);
    }
  }

  function restartGame() {
    if (!mode) return;
    setEndModalOpen(false);
    game.start(mode, game.yourSymbol, game.opponent);
  }

  async function saveFromModal() {
    try {
      await save();
      setEndModalOpen(false);
    } catch {
      // mantém aberto se falhar
    }
  }

  return (
    <div className="min-h-screen relative p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-4">
        <NeonCard title="Arena">
          <p className="text-white/70 text-sm mb-3">{header}</p>

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="text-white/90 font-semibold">{status}</div>
            <div className="flex gap-2">
              <button
                className="focus-ring rounded-xl px-3 py-2 text-sm glass"
                onClick={() => nav("/lobby")}
                type="button"
              >
                Lobby
              </button>
              <button
                className="focus-ring rounded-xl px-3 py-2 text-sm glass"
                onClick={restartGame}
                type="button"
              >
                Reiniciar
              </button>
            </div>
          </div>

          <Board board={game.board} onPlay={onPlay} locked={locked} />

          <p className="text-white/50 text-xs mt-4">
            Dica: no PVC, a CPU joga com Minimax. Ao salvar, o servidor valida reprocessando as jogadas.
          </p>
        </NeonCard>

        <NeonCard title="Painel">
          <div className="space-y-3">
            <div className="glass rounded-xl p-3">
              <p className="text-white/70 text-xs">Jogadas (ordem)</p>
              <div className="mt-2 text-white/80 text-sm flex flex-wrap gap-2">
                {game.moves.length === 0 ? <span className="text-white/40">—</span> : null}
                {game.moves.map((m, i) => (
                  <span key={i} className="glass rounded-lg px-2 py-1">
                    {i + 1}. {m.symbol}@{m.pos}
                  </span>
                ))}
              </div>
            </div>

            <NeonButton disabled={!game.result || saving} onClick={save} className="w-full">
              {saving ? "Salvando..." : "Salvar partida"}
            </NeonButton>

            <NeonButton onClick={() => nav("/ranking")} className="w-full">
              Ver ranking
            </NeonButton>
          </div>
        </NeonCard>
      </div>

      <Modal
        open={endModalOpen}
        title="Partida finalizada"
        onClose={() => setEndModalOpen(false)}
      >
        <p className="text-white/80">
          Resultado:{" "}
          <span className="font-bold">
            {game.result === "DRAW" ? "Empate" : game.result ? `Vitória do ${game.result}` : "—"}
          </span>
        </p>

        <div className="mt-4 flex gap-2">
          <NeonButton className="flex-1" onClick={restartGame}>
            Jogar de novo
          </NeonButton>

          <NeonButton className="flex-1" disabled={saving || !game.result} onClick={saveFromModal}>
            {saving ? "Salvando..." : "Salvar"}
          </NeonButton>
        </div>
      </Modal>
    </div>
  );
}
