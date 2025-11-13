import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

const PORT = 3000;

// Create WebSocket server
const wss = new WebSocketServer({ port: PORT });

// Track active rooms (optional - for logging/monitoring)
const activeRooms = new Map<string, number>();

// Handle new WebSocket connections
wss.on('connection', (ws, req) => {
  // Extract room name from URL path
  // Example: ws://localhost:3000/my-room-name
  const roomName = req.url?.split('?')[0] || 'default';
  
  // Update room tracking
  const currentCount = activeRooms.get(roomName) || 0;
  activeRooms.set(roomName, currentCount + 1);
  console.log(`Client connected to room: ${roomName} (${activeRooms.get(roomName)} active)`);
  
  // Setup Yjs WebSocket connection handler
  // This automatically handles all Yjs protocol messages
  // The room is determined by the URL path
  setupWSConnection(ws, req);
  
  ws.on('close', () => {
    const count = activeRooms.get(roomName) || 0;
    if (count > 1) {
      activeRooms.set(roomName, count - 1);
    } else {
      activeRooms.delete(roomName);
    }
    console.log(`Client disconnected from room: ${roomName}`);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`Yjs WebSocket server running on ws://localhost:${PORT}`);
console.log(`Connect to different rooms using: ws://localhost:${PORT}/room-name`);

