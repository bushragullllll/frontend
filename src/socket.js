import { io } from "socket.io-client";

// ===================== BACKEND SOCKET URL =====================
// const SOCKET_URL = "http://localhost:5000"; // old local backend
const SOCKET_URL = "https://backend-production-81c5.up.railway.app"; // Railway backend

// Use default transport (polling + websocket fallback)
export const socket = io(SOCKET_URL, {
  autoConnect: true,
});
