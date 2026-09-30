// src/hooks/useObservations.js
import { useState, useEffect, useCallback } from 'react';
import { observationService } from '../services/observationService.js';

export function useObservations(initialParams = {}) {
  const [observations, setObservations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchObservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await observationService.list(params);
      setObservations(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);

  return { observations, pagination, isLoading, error, setParams, refetch: fetchObservations };
}

