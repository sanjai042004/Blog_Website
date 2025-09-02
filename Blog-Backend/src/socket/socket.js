let io;

module.exports = {
  init: (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Listen for connections
    io.on("connection", (socket) => {
      console.log("🟢 A user connected:", socket.id);

      // Join a specific post room
      socket.on("joinPost", (postId) => {
        if (!postId) return;
        socket.join(postId);
        console.log(`User ${socket.id} joined post room: ${postId}`);
      });

      // Leave post room
      socket.on("leavePost", (postId) => {
        socket.leave(postId);
        console.log(`User ${socket.id} left post room: ${postId}`);
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    });

    return io;
  },

  // Get the io instance anywhere
  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
  },
};
