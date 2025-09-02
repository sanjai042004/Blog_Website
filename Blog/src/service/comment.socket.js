import { io } from "socket.io-client";

// Backend URL
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connect / Disconnect helpers
export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

// (Optional) Debug listeners
// socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
// socket.on("disconnect", () => console.log("🚩 Socket disconnected"));
// socket.on("connect_error", (err) => console.error("⚠️ Socket error:", err.message));

export default socket;
