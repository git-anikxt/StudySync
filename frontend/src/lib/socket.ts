import { io } from "socket.io-client";

function getSocketUrl() {
  const explicitUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL;

  if (explicitUrl) {
    return explicitUrl;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL;

  if (baseUrl) {
    try {
      return new URL(baseUrl).origin;
    } catch {
      // Not a full URL - fall through to the default.
    }
  }

  return "http://localhost:5000";
}

export const socket = io(
  getSocketUrl(),
  { autoConnect: false }
);