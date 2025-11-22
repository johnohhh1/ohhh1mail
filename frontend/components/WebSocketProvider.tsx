'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001';
    const websocket = new WebSocket(`${wsUrl}/ws?token=${token}`);

    websocket.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    websocket.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📧 WebSocket message:', data);

        if (data.type === 'new_email') {
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Email', {
              body: `${data.data.from_address}: ${data.data.subject}`,
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
