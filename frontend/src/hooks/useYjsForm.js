import { useState, useEffect, useCallback, useRef } from 'react';
import { createYjsDocument, getFormMap } from '../yjs-setup';

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
  const formMapRef = useRef(null);

  useEffect(() => {
    const { ydoc, wsProvider, idbProvider } = createYjsDocument(roomName, wsUrl);
    const formMap = getFormMap(ydoc);
    formMapRef.current = formMap;

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
    awareness.setLocalStateField('user', { id: userId, name: userId });

    // Listen for awareness changes
    const updateAwareness = () => {
      const states = {};
      awareness.getStates().forEach((state, clientId) => {
        if (clientId !== awareness.clientID) {
          states[clientId] = state;
        }
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

  return {
    formData,
    updateField,
    isConnected,
    awareness
  };
}

