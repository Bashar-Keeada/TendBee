import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 */
export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Ett fel uppstod');
      setLoading(false);
      throw err;
    }
  }, []);
  
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);
  
  return { loading, error, execute, reset };
}

/**
 * Custom hook for fetching data on mount
 */
export function useFetch(apiCall, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Ett fel uppstod');
      setLoading(false);
    }
  }, dependencies);
  
  return { data, loading, error, refetch };
}

export default useAPI;
