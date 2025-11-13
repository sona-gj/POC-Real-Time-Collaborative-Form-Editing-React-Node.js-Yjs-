import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';

/**
 * Creates and configures a Yjs document with WebSocket and IndexedDB providers
 * 
 * @param {string} roomName - The room/document name (e.g., "form-123")
 * @param {string} wsUrl - WebSocket server URL (e.g., "ws://localhost:3000")
 * @returns {Object} - { ydoc, wsProvider, idbProvider }
 */
export function createYjsDocument(roomName, wsUrl = 'ws://localhost:3000') {
  // 1. Create Yjs document - this is our shared data structure
  const ydoc = new Y.Doc();

  // 2. Create WebSocket provider for real-time sync
  // This connects to our backend and syncs changes in real-time
  const wsProvider = new WebsocketProvider(wsUrl, roomName, ydoc);

  // 3. Create IndexedDB provider for offline persistence
  // This saves the document locally so it works offline
  const idbProvider = new IndexeddbPersistence(roomName, ydoc);

  return { ydoc, wsProvider, idbProvider };
}

/**
 * Gets or creates a Y.Map (key-value store) for form data
 * 
 * @param {Y.Doc} ydoc - The Yjs document
 * @param {string} mapName - Name of the map (default: "form")
 * @returns {Y.Map} - The Y.Map instance
 */
export function getFormMap(ydoc, mapName = 'form') {
  return ydoc.getMap(mapName);
}

