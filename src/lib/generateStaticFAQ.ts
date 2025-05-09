import { FetchOptions, FAQ } from '../types';
import { fetchFaqs } from './fetchFaqs';

/**
 * Fetches FAQ data at build time for static site generation
 * @param options - Configuration options for the API request
 * @returns Promise resolving to an array of FAQ items
 */
export async function generateStaticFAQ(options: FetchOptions): Promise<{
  faqs: FAQ[];
}> {
  try {
    const data = await fetchFaqs(options);
    console.log(`Generated static FAQ page with ${data.faqs.length} FAQ items`);
    return {
      faqs: data.faqs,
    };
  } catch (error) {
    console.error('Error generating static FAQ page:', error);
    return {
      faqs: [],
    };
  }
}