import { create } from "zustand";
import axiosInstance, { getErrorMessage } from "../lib/axiosInstance.js";
import { useAuthStore } from "./useAuthStore.js";

const upsertMessage = (messages, message) => {
  const index = messages.findIndex((item) => item._id === message._id);
  if (index === -1) return [...messages, message];
  return messages.map((item, itemIndex) => (itemIndex === index ? { ...item, ...message } : item));
};

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  typingUsers: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  sendError: "",

  setSelectedUser: (selectedUser) => set({ selectedUser, messages: [], sendError: "" }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/users");
      set({ users: data });
    } catch (error) {
      set({ sendError: getErrorMessage(error, "Could not load users") });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, sendError: "" });
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: data });
      get().markMessagesRead(userId);
    } catch (error) {
      set({ sendError: getErrorMessage(error, "Could not load messages") });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (payload) => {
    const receiverId = get().selectedUser?._id;
    if (!receiverId) return { ok: false, error: "Select a user first" };
    try {
      const { data } = await axiosInstance.post(`/messages/send/${receiverId}`, payload);
      set((state) => ({ messages: upsertMessage(state.messages, data), sendError: "" }));
      get().getUsers();
      return { ok: true };
    } catch (error) {
      const message = getErrorMessage(error, "Could not send message");
      set({ sendError: message });
      return { ok: false, error: message };
    }
  },

  markMessagesRead: (senderId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !senderId) return;
    socket.emit("messagesRead", { senderId });
    set((state) => ({
      users: state.users.map((user) => (user._id === senderId ? { ...user, unreadCount: 0 } : user)),
      messages: state.messages.map((message) =>
        String(message.senderId) === String(senderId) && message.status !== "read"
          ? { ...message, status: "read", readAt: new Date().toISOString() }
          : message,
      ),
    }));
  },

  emitTyping: (isTyping) => {
    const socket = useAuthStore.getState().socket;
    const receiverId = get().selectedUser?._id;
    if (socket && receiverId) socket.emit(isTyping ? "typing" : "stopTyping", { receiverId });
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    get().unsubscribeFromMessages();

    socket.on("newMessage", (message) => {
      const selectedId = get().selectedUser?._id;
      if (String(message.senderId) === String(selectedId)) {
        set((state) => ({ messages: upsertMessage(state.messages, message) }));
        get().markMessagesRead(selectedId);
      }
      get().getUsers();
    });

    socket.on("messageDelivered", ({ messageId, status }) => {
      set((state) => ({
        messages: state.messages.map((message) => (message._id === messageId ? { ...message, status } : message)),
      }));
    });

    socket.on("messagesRead", ({ senderId }) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          String(message.receiverId) === String(senderId)
            ? { ...message, status: "read", readAt: new Date().toISOString() }
            : message,
        ),
      }));
    });

    socket.on("typing", ({ senderId }) => {
      set((state) => ({ typingUsers: [...new Set([...state.typingUsers, String(senderId)])] }));
    });
    socket.on("stopTyping", ({ senderId }) => {
      set((state) => ({ typingUsers: state.typingUsers.filter((id) => id !== String(senderId)) }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    ["newMessage", "messageDelivered", "messagesRead", "typing", "stopTyping"].forEach((event) => socket.off(event));
  },

  reset: () => set({ users: [], messages: [], selectedUser: null, typingUsers: [], sendError: "" }),
}));
