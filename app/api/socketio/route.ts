import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

const handler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("order:update-status", (data) => {
        io.emit("order:status-updated", data);
      });

      socket.on("chat:send-message", (data) => {
        io.to(data.roomId).emit("chat:message", data);
      });

      socket.on("inventory:update", (data) => {
        io.emit("inventory:updated", data);
      });

      socket.on("join-room", (roomId) => {
        socket.join(roomId);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default handler;
