import { io } from "socket.io-client";

// Use default transport (polling + websocket fallback)
export const socket = io("http://localhost:5000", {
  autoConnect: true,
});
