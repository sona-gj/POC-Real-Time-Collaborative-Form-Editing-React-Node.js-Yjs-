import { useState, useEffect, useCallback, useRef } from 'react';
import { createYjsDocument, getFormMap } from '../yjs-setup';

// Generate persistent color for user based on userId
function getUserColor(userId) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Custom hook for collaborative form editing with Yjs
 * 
 * @param {string} roomName - The room/document name
 * @param {string} userId - Unique user identifier
 * @param {string} wsUrl - WebSocket server URL
 * @returns {Object} - Form state and functions
 */
export function useYjsForm(roomName, userId = 'user-' + Math.random().toString(36).substr(2, 9), wsUrl = 'ws://localhost:3000') {
  const [formData, setFormData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [awareness, setAwareness] = useState({});
  const [myClientId, setMyClientId] = useState(null);
  const formMapRef = useRef(null);
  const awarenessRef = useRef(null);
  const wsProviderRef = useRef(null);

  useEffect(() => {
    const { ydoc, wsProvider, idbProvider } = createYjsDocument(roomName, wsUrl);
    const formMap = getFormMap(ydoc);
    formMapRef.current = formMap;
    wsProviderRef.current = wsProvider;

    // Get initial form data from Yjs document
    const initialData = {};
    formMap.forEach((value, key) => {
      initialData[key] = value;
    });
    setFormData(initialData);

    // Listen for changes in the Yjs document
    const updateFormData = () => {
      const newData = {};
      formMap.forEach((value, key) => {
        newData[key] = value;
      });
      setFormData(newData);
    };

    formMap.observe(updateFormData);

    // Track connection status
    wsProvider.on('status', (event) => {
      setIsConnected(event.status === 'connected');
    });

    // Set up awareness (who's editing what)
    const awareness = wsProvider.awareness;
    awarenessRef.current = awareness;
    
    // Set initial awareness state with user info and color
    const userColor = getUserColor(userId);
    awareness.setLocalStateField('user', { 
      id: userId, 
      name: userId,
      color: userColor
    });
    
    setMyClientId(awareness.clientID);

    // Listen for awareness changes
    const updateAwareness = () => {
      const states = {};
      awareness.getStates().forEach((state, clientId) => {
        states[clientId] = {
          ...state,
          clientId,
          isMe: clientId === awareness.clientID
        };
      });
      setAwareness(states);
    };

    awareness.on('change', updateAwareness);
    updateAwareness();

    // Cleanup on unmount
    return () => {
      formMap.unobserve(updateFormData);
      awareness.off('change', updateAwareness);
      wsProvider.destroy();
      idbProvider.destroy();
      ydoc.destroy();
    };
  }, [roomName, userId, wsUrl]);

  // Update a form field
  const updateField = useCallback((fieldName, value) => {
    if (formMapRef.current) {
      formMapRef.current.set(fieldName, value);
    }
  }, []);

  // Update cursor position (call when user focuses/edits a field)
  const updateCursorPosition = useCallback((fieldName, cursorPosition) => {
    if (awarenessRef.current) {
      awarenessRef.current.setLocalStateField('cursor', {
        field: fieldName,
        position: cursorPosition
      });
    }
  }, []);

  // Clear cursor position (call when user blurs a field)
  const clearCursorPosition = useCallback(() => {
    if (awarenessRef.current) {
      awarenessRef.current.setLocalStateField('cursor', null);
    }
  }, []);

  return {
    formData,
    updateField,
    updateCursorPosition,
    clearCursorPosition,
    isConnected,
    awareness,
    myClientId
  };
}

