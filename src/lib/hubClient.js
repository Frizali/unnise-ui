import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection = null;
const listeners = new Map();

function getHubUrl() {
  return (
    process.env.REACT_APP_BOARD_HUB_URL ||
    "http://localhost:5157/hubs/board"
  );
}

async function ensureConnection() {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(getHubUrl(), {
      accessTokenFactory: () => localStorage.getItem("accessToken") || "",
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.onreconnecting((err) => console.warn("SignalR reconnecting", err));
  connection.onreconnected(() => console.info("SignalR reconnected"));

  try {
    await connection.start();
    console.info("SignalR connected to", getHubUrl());
  } catch (err) {
    console.error("SignalR failed to start", err);
    connection = null;
    throw err;
  }

  return connection;
}

export async function on(eventName, handler) {
  const conn = await ensureConnection();
  conn.on(eventName, handler);
  const set = listeners.get(eventName) || new Set();
  set.add(handler);
  listeners.set(eventName, set);
}

export async function off(eventName, handler) {
  if (!connection) return;
  connection.off(eventName, handler);
  const set = listeners.get(eventName);
  if (set) {
    set.delete(handler);
    if (set.size === 0) listeners.delete(eventName);
  }
}

export async function invoke(methodName, ...args) {
  const conn = await ensureConnection();
  return conn.invoke(methodName, ...args);
}

export async function joinProjectRoom(projectId) {
  return invoke("JoinProjectRoom", projectId);
}

export async function leaveProjectRoom(projectId) {
  if (!connection) return;
  try {
    return await connection.invoke("LeaveProjectRoom", projectId);
  } catch (err) {
    console.warn("leaveProjectRoom failed", err);
  }
}

export async function stop() {
  if (!connection) return;
  try {
    await connection.stop();
  } finally {
    connection = null;
    listeners.clear();
  }
}

export default {
  on,
  off,
  invoke,
  joinProjectRoom,
  leaveProjectRoom,
  stop,
};
