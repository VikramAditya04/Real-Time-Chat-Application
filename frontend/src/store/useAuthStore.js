import { create } from "zustand";
import { io } from "socket.io-client";
import axiosInstance, { getErrorMessage, SERVER_URL } from "../lib/axiosInstance.js";

const saveSession = (data) => {
  const { token, ...user } = data;
  if (token) sessionStorage.setItem("chatzy_token", token);
  return user;
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  socket: null,
  socketStatus: "disconnected",
  socketError: "",
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check");
      set({ authUser: data });
      get().connectSocket();
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const { data } = await axiosInstance.post("/auth/signup", credentials);
      set({ authUser: saveSession(data) });
      get().connectSocket();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Could not create account") };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", credentials);
      set({ authUser: saveSession(data) });
      get().connectSocket();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Could not log in") };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      sessionStorage.removeItem("chatzy_token");
      get().disconnectSocket();
      set({ authUser: null, onlineUsers: [] });
    }
  },

  updateProfile: async (profilePic) => {
    set({ isUpdatingProfile: true });
    try {
      const { data } = await axiosInstance.put("/auth/update-profile", { profilePic });
      set({ authUser: data });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Could not update profile") };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    if (!get().authUser || get().socket?.connected) return;

    const socket = io(SERVER_URL, {
      withCredentials: true,
      autoConnect: false,
      auth: { token: sessionStorage.getItem("chatzy_token") },
    });
    socket.on("connect", () => set({ socketStatus: "connected", socketError: "" }));
    socket.on("disconnect", (reason) => {
      set({ socketStatus: reason === "io client disconnect" ? "disconnected" : "reconnecting" });
    });
    socket.on("getOnlineUsers", (onlineUsers) => set({ onlineUsers }));
    socket.on("connect_error", () => {
      set({ socketStatus: "error", socketError: "Live connection unavailable. Retrying…" });
    });
    socket.on("socketError", ({ message }) => {
      set({ socketError: message || "A real-time operation failed." });
    });
    socket.connect();
    set({ socket, socketStatus: "connecting", socketError: "" });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ socket: null, socketStatus: "disconnected", socketError: "" });
  },
}));
