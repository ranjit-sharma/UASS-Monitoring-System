// src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService.js';

export function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [latest, setLatest] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const [summaryData, latestData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getLatest(50),
      ]);
      setSummary(summaryData);
      setLatest(latestData.reverse()); // chronological for charts
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, latest, isLoading, error, refetch: fetch };
}

