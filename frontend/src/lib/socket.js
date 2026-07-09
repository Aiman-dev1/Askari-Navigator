import { io } from "socket.io-client";
import { API_URL, getToken } from "./api";

let socket = null;

// One shared socket per session, authenticated with the same JWT as the REST API.
export function getSocket() {
  if (!socket) {
    socket = io(API_URL, { auth: { token: getToken() } });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
