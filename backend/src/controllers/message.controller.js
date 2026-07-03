import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketIds, io } from "../config/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    const conversations = await Promise.all(
      filteredUsers.map(async (user) => {
        const [lastMessage, unreadCount] = await Promise.all([
          Message.findOne({
            $or: [
              { senderId: loggedInUserId, receiverId: user._id },
              { senderId: user._id, receiverId: loggedInUserId },
            ],
          }).sort({ createdAt: -1 }),
          Message.countDocuments({ senderId: user._id, receiverId: loggedInUserId, status: { $ne: "read" } }),
        ]);

        return { ...user.toObject(), lastMessage, unreadCount };
      })
    );

    conversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text?.trim() && !image) {
      return res.status(400).json({ message: "A message or image is required" });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text?.trim(),
      image: imageUrl,
    });

    await newMessage.save();

    let savedMessage = newMessage;
    const receiverSocketIds = getReceiverSocketIds(receiverId);
    if (receiverSocketIds.length > 0) {
      const deliveredMessage = await Message.findByIdAndUpdate(
        newMessage._id,
        {
          status: "delivered",
          deliveredAt: new Date(),
        },
        { new: true }
      );
      savedMessage = deliveredMessage;

      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", deliveredMessage);
      });

      const senderSocketIds = getReceiverSocketIds(senderId);
      senderSocketIds.forEach((socketId) => {
        io.to(socketId).emit("messageDelivered", {
          messageId: deliveredMessage._id,
          senderId,
          receiverId,
          status: deliveredMessage.status,
        });
      });
    } else {
      // Receiver is offline; the message stays in "sent" state until they connect.
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
