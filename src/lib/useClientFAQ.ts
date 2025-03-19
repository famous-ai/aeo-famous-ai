import { useState, useEffect } from 'react';
import { FAQ, FetchOptions } from '../types';
import { fetchFaqs } from './fetchFaqs';

export interface UseClientFAQOptions extends FetchOptions {
  /**
   * Automatically fetch on component mount
   */
  autoFetch?: boolean;
}

export interface UseClientFAQResult {
  /**
   * Array of FAQ items
   */
  faqs: FAQ[];
  /**
   * Loading state
   */
  loading: boolean;
  /**
   * Error state
   */
  error: Error | null;
  /**
   * Function to manually trigger fetch
   */
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching FAQ data client-side
 * @param options - Configuration options
 * @returns FAQ data and state
 */
export function useClientFAQ(options: UseClientFAQOptions): UseClientFAQResult {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchFaqs(options);
      setFaqs(data.faqs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [options.apiUrl]);

  return {
    faqs,
    loading,
    error,
    refetch: fetchData,
  };
}