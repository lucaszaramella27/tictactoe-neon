import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NeonCard } from "../components/NeonCard";
import { NeonButton } from "../components/NeonButton";
import { useAuthStore } from "../stores/authStore";
import { useGameStore } from "../stores/gameStore";
import { useUIStore } from "../stores/uiStore";
import * as api from "../lib/api";
import type { Mode, Symbol, User } from "../utils/types";

export function LobbyPage() {
  const nav = useNavigate();
  const auth = useAuthStore();
  const game = useGameStore();
  const ui = useUIStore();

  const [mode, setMode] = useState<Mode>("PVC");
  const [yourSymbol, setYourSymbol] = useState<Symbol>("X");
  const [users, setUsers] = useState<User[]>([]);
  const [opponentId, setOpponentId] = useState<string>("");

  const opponent = useMemo(
    () => users.find((u) => u.id === opponentId) ?? null,
    [users, opponentId]
  );

  useEffect(() => {
    (async () => {
      try {
        if (!auth.token) return;
        const list = await api.listUsers(auth.token);
        setUsers(list);
      } catch (err) {
        ui.push({
          type: "error",
          message: err instanceof Error ? err.message : "Falha ao listar usuários",
        });
      }
    })();
  }, [auth.token, ui]);

  // UX: se sair do PVP, limpa o oponente
  useEffect(() => {
    if (mode !== "PVP") setOpponentId("");
  }, [mode]);

  function start() {
    if (!auth.token) {
      nav("/");
      return;
    }
    if (mode === "PVP" && !opponent) {
      ui.push({ type: "error", message: "Selecione um oponente cadastrado para PVP." });
      return;
    }
    game.start(mode, yourSymbol, opponent);
    nav("/game");
  }

  return (
    // Centraliza vertical e horizontal + padding seguro
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Card “maior” e centralizado */}
      <div className="w-full max-w-6xl">
        {/* Em telas grandes: 2 colunas; em pequenas: 1 coluna */}
        <div className="grid lg:grid-cols-2 gap-6">
          <NeonCard title="Lobby">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-white/80 font-semibold">
                  {auth.user?.display_name ?? "—"}
                </p>
                <p className="text-white/50 text-xs">{auth.user?.email ?? ""}</p>
              </div>

              <button
                className="focus-ring rounded-xl px-3 py-2 text-sm glass hover:opacity-90"
                onClick={() => auth.logout()}
                type="button"
              >
                Sair
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-white/70 text-sm mb-2">Modo</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`focus-ring rounded-xl px-3 py-2 text-sm ${
                      mode === "PVC" ? "glass neon-outline" : "glass opacity-70"
                    }`}
                    onClick={() => setMode("PVC")}
                    type="button"
                  >
                    PVC (Minimax)
                  </button>

                  <button
                    className={`focus-ring rounded-xl px-3 py-2 text-sm ${
                      mode === "PVP" ? "glass neon-outline" : "glass opacity-70"
                    }`}
                    onClick={() => setMode("PVP")}
                    type="button"
                  >
                    PVP (local)
                  </button>
                </div>

                <p className="text-white/50 text-xs mt-2">
                  PVP é “pass-and-play” no mesmo navegador. O backend valida o resultado ao salvar.
                </p>
              </div>

              <div>
                <p className="text-white/70 text-sm mb-2">Seu símbolo</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`focus-ring rounded-xl px-3 py-2 text-sm ${
                      yourSymbol === "X" ? "glass neon-outline" : "glass opacity-70"
                    }`}
                    onClick={() => setYourSymbol("X")}
                    type="button"
                  >
                    X (começa)
                  </button>

                  <button
                    className={`focus-ring rounded-xl px-3 py-2 text-sm ${
                      yourSymbol === "O" ? "glass neon-outline" : "glass opacity-70"
                    }`}
                    onClick={() => setYourSymbol("O")}
                    type="button"
                  >
                    O
                  </button>
                </div>
              </div>

              <div className={mode === "PVP" ? "" : "opacity-60"}>
                <p className="text-white/70 text-sm mb-2">Oponente cadastrado</p>
                <select
                  className="focus-ring w-full glass rounded-xl px-3 py-2 text-white/90"
                  value={opponentId}
                  onChange={(e) => setOpponentId(e.target.value)}
                  disabled={mode !== "PVP"}
                >
                  <option value="">Selecione…</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.display_name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <NeonButton onClick={start} className="w-full">
                Iniciar partida
              </NeonButton>

              <div className="pt-2">
                <NeonButton className="w-full" onClick={() => nav("/ranking")}>
                  Ver ranking
                </NeonButton>
              </div>
            </div>
          </NeonCard>

          <NeonCard title="Atalhos + Regras">
            <ul className="text-white/70 text-sm space-y-2">
              <li>• Pontuação: Vitória +3, Empate +1, Derrota +0</li>
              <li>• No PVC: apenas o humano entra no ranking</li>
              <li>• O backend reprocessa jogadas e bloqueia partidas inválidas</li>
            </ul>

            <div className="mt-5">
              <button
                className="focus-ring w-full rounded-xl px-3 py-2 text-sm glass hover:opacity-90"
                onClick={() => nav("/game")}
                type="button"
              >
                Voltar para o jogo (se já iniciou)
              </button>
            </div>
          </NeonCard>
        </div>
      </div>
    </div>
  );
}
