import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
    path: '/api/socketio',
    addTrailingSlash: false,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Real-time event listeners
export const onOrderStatusUpdate = (callback: (data: any) => void) => {
  const socket = getSocket();
  socket.on('order:status-updated', callback);
};

export const onInventoryUpdate = (callback: (data: any) => void) => {
  const socket = getSocket();
  socket.on('inventory:updated', callback);
};

export const onMessageReceived = (callback: (data: any) => void) => {
  const socket = getSocket();
  socket.on('chat:message', callback);
};

// Emit functions
export const emitOrderUpdate = (orderId: string, status: string) => {
  const socket = getSocket();
  socket.emit('order:update-status', { orderId, status });
};

export const emitChatMessage = (message: string, roomId: string) => {
  const socket = getSocket();
  socket.emit('chat:send-message', { message, roomId });
};
