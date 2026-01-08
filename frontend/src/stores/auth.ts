import { create } from "zustand";
import * as api from "../lib/api";

type AuthState = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  registerAndLogin: (email: string, display_name: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),

  login: async (email, password) => {
    const { access_token } = await api.login(email, password);
    localStorage.setItem("token", access_token);
    set({ token: access_token });
  },

  registerAndLogin: async (email, display_name, password) => {
    await api.register(email, display_name, password);
    const { access_token } = await api.login(email, password);
    localStorage.setItem("token", access_token);
    set({ token: access_token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
}));
