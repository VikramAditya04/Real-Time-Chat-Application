import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.model.js";

let io;

const userSocketMap = {}; // { userId: Set<socketId> }

function parseCookieHeader(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");

    if (!rawKey) {
      return cookies;
    }

    cookies[rawKey] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

function getAllowedOrigins() {
  return [
    "http://localhost:5173",
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : []),
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
  ]
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function addUserSocket(userId, socketId) {
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = new Set();
  }

  userSocketMap[userId].add(socketId);
}

function removeUserSocket(userId, socketId) {
  const socketIds = userSocketMap[userId];
  if (!socketIds) {
    return;
  }

  socketIds.delete(socketId);

  if (socketIds.size === 0) {
    delete userSocketMap[userId];
  }
}

function emitOnlineUsers() {
  if (io) {
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }
}

export function getReceiverSocketIds(userId) {
  return Array.from(userSocketMap[userId] || []);
}

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const cookies = parseCookieHeader(cookieHeader);
      const token = socket.handshake.auth?.token || cookies.jwt;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.userId;
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.userId;
    if (userId) {
      addUserSocket(userId, socket.id);
    }

    emitOnlineUsers();

    try {
      const pendingMessages = await Message.find({ receiverId: userId, status: "sent" }).select("_id senderId");
      if (pendingMessages.length > 0) {
        const deliveredAt = new Date();
        await Message.updateMany(
          { _id: { $in: pendingMessages.map((message) => message._id) } },
          { $set: { status: "delivered", deliveredAt } },
        );
        pendingMessages.forEach((message) => {
          getReceiverSocketIds(String(message.senderId)).forEach((socketId) => {
            io.to(socketId).emit("messageDelivered", { messageId: String(message._id), senderId: String(message.senderId), receiverId: userId, status: "delivered" });
          });
        });
      }
    } catch (error) {
      console.error("Failed to update pending message delivery:", error.message);
      socket.emit("socketError", { message: "Could not synchronize message delivery status." });
    }

    socket.on("typing", ({ receiverId }) => {
      const receiverSocketIds = getReceiverSocketIds(receiverId);

      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("typing", { senderId: userId });
      });
    });

    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocketIds = getReceiverSocketIds(receiverId);

      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("stopTyping", { senderId: userId });
      });
    });

    socket.on("messagesRead", async ({ senderId }) => {
      if (!userId || !senderId) {
        return;
      }

      try {
        await Message.updateMany(
          { senderId, receiverId: userId, status: { $ne: "read" } },
          { $set: { status: "read", readAt: new Date() } },
        );

        const senderSocketIds = getReceiverSocketIds(senderId);
        senderSocketIds.forEach((socketId) => {
          io.to(socketId).emit("messagesRead", {
            senderId: userId,
            recipientId: senderId,
          });
        });
      } catch (error) {
        console.error("Failed to mark messages as read:", error.message);
        socket.emit("socketError", { message: "Could not update read receipts." });
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      if (userId) {
        removeUserSocket(userId, socket.id);
        emitOnlineUsers();
      }
    });
  });

  return io;
}

export { io };
