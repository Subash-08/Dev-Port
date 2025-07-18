const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');

const intializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: true,        // ✅ Allow all origins
            credentials: true
        }
    })
    io.on("connection", (socket) => {
        socket.on("joinChat", ({ loggedInUser, userId }) => {
            const roomId  = [loggedInUser, userId].sort().join("_")
            
            socket.join(roomId)
 

        });
       socket.on("sendMessage", async ({ senderId, senderName, receiverId, message }) => {
  try {
    const roomId = [senderId, receiverId].sort().join("_");

    // Find or create chat
    let chat = await Chat.findOne({ 
      participants: { $all: [senderId, receiverId], $size: 2 }
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        messages: []
      });
    }

    // Add new message
    const newMessage = {
      senderId,
      text: message,
      seenBy: [senderId], // sender has seen their own message
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Emit to both participants
    io.to(roomId).emit("receiveMessage", {
      senderId,
      senderName,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error saving message:", error);
    socket.emit("errorMessage", { message: "Failed to send message" });
  }
});

        socket.on("disconnect", () => {

        });
    });
}

module.exports = intializeSocket