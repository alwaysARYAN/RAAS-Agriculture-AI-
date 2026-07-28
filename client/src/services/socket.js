import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId) => {
  // Socket.IO disabled for production - using REST API only
  if (process.env.NODE_ENV === 'production') {
    console.log('ℹ️ Socket.IO disabled in production, using REST API');
    return null;
  }

  if (!socket && userId) {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiUrl.replace('/api', '');
    
    try {
      socket = io(socketUrl, {
        auth: { userId },
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: false // Disable auto-reconnect to prevent errors
      });

      socket.on('connect', () => {
        console.log('✅ Socket connected');
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      socket.on('connect_error', (error) => {
        console.warn('Socket connection failed, using REST API fallback');
        socket = null; // Clear socket on error
      });
    } catch (error) {
      console.warn('Socket initialization failed, using REST API');
      socket = null;
    }
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default { initializeSocket, disconnectSocket, getSocket };
