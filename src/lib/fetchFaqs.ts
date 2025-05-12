import { FAQResponse, FetchOptions } from '../types';

/**
 * Fetches FAQ data from the specified API endpoint
 * @param options - Configuration options for the API request
 * @returns Promise resolving to the FAQ data
 */
export async function fetchFaqs(options: FetchOptions): Promise<FAQResponse> {
  try {
    const response = await fetch(options.apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.statusText}`);
    }

    const data = await response.json();
    return data as FAQResponse;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
}