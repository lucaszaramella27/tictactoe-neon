import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NeonCard } from "../components/NeonCard";
import { NeonButton } from "../components/NeonButton";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";

export function LoginPage() {
  const nav = useNavigate();
  const { login, register, loading } = useAuthStore();
  const ui = useUIStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(email, password);
        ui.push({ type: "success", message: "Login efetuado. Bem-vindo ao Neon Grid." });
      } else {
        await register(email, displayName, password);
        ui.push({ type: "success", message: "Conta criada e login efetuado." });
      }
      nav("/lobby");
    } catch (err) {
      ui.push({ type: "error", message: err instanceof Error ? err.message : "Erro" });
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <NeonCard title="Tic-Tac-Toe // Neon">
          <p className="text-white/70 text-sm mb-4">
            Tema futurista + glassmorphism. Autentique para salvar partidas e subir no ranking.
          </p>

          <div className="flex gap-2 mb-4">
            <button
              className={`focus-ring rounded-xl px-3 py-2 text-sm ${mode === "login" ? "glass neon-outline" : "glass opacity-70"}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={`focus-ring rounded-xl px-3 py-2 text-sm ${mode === "register" ? "glass neon-outline" : "glass opacity-70"}`}
              onClick={() => setMode("register")}
              type="button"
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="text-white/70 text-xs">E-mail</span>
              <input
                className="mt-1 w-full glass rounded-xl px-3 py-2 text-white/90 focus-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>

            {mode === "register" ? (
              <label className="block">
                <span className="text-white/70 text-xs">Display name</span>
                <input
                  className="mt-1 w-full glass rounded-xl px-3 py-2 text-white/90 focus-ring"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  maxLength={60}
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-white/70 text-xs">Senha</span>
              <input
                className="mt-1 w-full glass rounded-xl px-3 py-2 text-white/90 focus-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>

            <NeonButton disabled={loading} type="submit" className="w-full">
              {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar conta"}
            </NeonButton>
          </form>
        </NeonCard>

        <p className="text-center text-xs text-white/50">
          Use teclado: TAB navega, ENTER joga. Acessibilidade com foco visível e botões.
        </p>
      </div>
    </div>
  );
}
