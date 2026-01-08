import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NeonCard } from "../components/NeonCard";
import { NeonButton } from "../components/NeonButton";
import { useUIStore } from "../stores/uiStore";
import type { RankingRow } from "../utils/types";
import * as api from "../lib/api";

export function RankingPage() {
  const nav = useNavigate();
  const ui = useUIStore();
  const [rows, setRows] = useState<RankingRow[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setRows(await api.topRanking());
      } catch (err) {
        ui.push({ type: "error", message: err instanceof Error ? err.message : "Falha ao carregar ranking" });
      }
    })();
  }, [ui]);

  return (
    <div className="min-h-screen relative p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <NeonCard title="Ranking — Top 20">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/70">
                <tr>
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Jogador</th>
                  <th className="text-right py-2">Pts</th>
                  <th className="text-right py-2">V</th>
                  <th className="text-right py-2">D</th>
                  <th className="text-right py-2">E</th>
                  <th className="text-right py-2">Jogos</th>
                </tr>
              </thead>
              <tbody className="text-white/90">
                {rows.map((r, i) => (
                  <tr key={r.user_id} className="border-t border-white/10">
                    <td className="py-2">{i + 1}</td>
                    <td className="py-2">{r.display_name}</td>
                    <td className="py-2 text-right font-semibold">{r.points}</td>
                    <td className="py-2 text-right">{r.wins}</td>
                    <td className="py-2 text-right">{r.losses}</td>
                    <td className="py-2 text-right">{r.draws}</td>
                    <td className="py-2 text-right">{r.games_played}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-3 text-white/50" colSpan={7}>
                      Nenhuma partida salva ainda.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-2">
            <NeonButton onClick={() => nav("/lobby")} className="flex-1">
              Voltar ao Lobby
            </NeonButton>
            <button className="focus-ring rounded-xl px-4 py-2 glass flex-1" onClick={() => nav("/game")} type="button">
              Voltar ao Jogo
            </button>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
