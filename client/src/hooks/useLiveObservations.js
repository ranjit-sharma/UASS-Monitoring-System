// src/hooks/useLiveObservations.js
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const MAX_BUFFER = 100;

export function useLiveObservations() {
  const { socket } = useSocket();
  const [observations, setObservations] = useState([]);
  const bufferRef = useRef([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!socket) return;

    function handleNewObservation(observation) {
      bufferRef.current = [observation, ...bufferRef.current].slice(0, MAX_BUFFER);
      setObservations([...bufferRef.current]);
    }

    socket.on('observation:new', handleNewObservation);

    return () => {
      socket.off('observation:new', handleNewObservation);
    };
  }, [socket]);

  return observations;
}
