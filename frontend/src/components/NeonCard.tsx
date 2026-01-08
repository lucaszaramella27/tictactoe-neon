import type { ReactNode } from "react";

export function NeonCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="glass neon-outline rounded-2xl p-5 shadow-neon">
      {title ? <h2 className="text-lg font-semibold text-white/90 mb-3">{title}</h2> : null}
      {children}
    </section>
  );
}
