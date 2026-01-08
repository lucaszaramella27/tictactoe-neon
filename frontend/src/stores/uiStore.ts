import { create } from "zustand";

type Toast = { id: string; type: "success" | "error" | "info"; message: string };

type UIState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({
      toasts: [...s.toasts, { ...t, id: crypto.randomUUID() }]
    })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
}));
