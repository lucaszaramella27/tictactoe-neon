import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../utils/types";
import * as api from "../lib/api";

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, displayName: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { access_token } = await api.login(email, password);
          set({ token: access_token });
          const u = await api.me(access_token);
          set({ user: u });
        } finally {
          set({ loading: false });
        }
      },

      register: async (email, displayName, password) => {
        set({ loading: true });
        try {
          await api.register(email, displayName, password);
          await get().login(email, password);
        } finally {
          set({ loading: false });
        }
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        const u = await api.me(token);
        set({ user: u });
      },

      logout: () => set({ token: null, user: null })
    }),
    { name: "ttt-auth" }
  )
);
