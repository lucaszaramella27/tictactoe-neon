import { useUIStore } from "../stores/uiStore";

export function Toasts() {
  const { toasts, remove } = useUIStore();
  return (
    <div className="fixed z-50 right-4 top-4 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass neon-outline rounded-xl px-4 py-3 text-sm text-white/90 shadow-neon"
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "ℹ️"}
            </div>
            <div className="flex-1">{t.message}</div>
            <button className="focus-ring rounded-lg px-2 text-white/70 hover:text-white" onClick={() => remove(t.id)}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
