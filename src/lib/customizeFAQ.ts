import { FAQ } from '../types';

export interface FAQTransformOptions {
  /**
   * Filters FAQs based on a search term
   */
  searchTerm?: string;
  /**
   * Limits the number of FAQs returned
   */
  limit?: number;
  /**
   * Custom sorting function for FAQs
   */
  sortFn?: (a: FAQ, b: FAQ) => number;
  /**
   * Custom filtering function for FAQs
   */
  filterFn?: (faq: FAQ) => boolean;
}

/**
 * Utility to transform and customize FAQ data
 * @param faqs - Array of FAQ items
 * @param options - Transformation options
 * @returns Transformed FAQ array
 */
export function customizeFAQ(faqs: FAQ[], options: FAQTransformOptions = {}): FAQ[] {
  let result = [...faqs];

  // Apply custom filter if provided
  if (options.filterFn) {
    result = result.filter(options.filterFn);
  }

  // Apply search term filter if provided
  if (options.searchTerm) {
    const searchLower = options.searchTerm.toLowerCase();
    result = result.filter(
      faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower)
    );
  }

  // Apply custom sort if provided
  if (options.sortFn) {
    result.sort(options.sortFn);
  }

  // Apply limit if provided
  if (options.limit && options.limit > 0) {
    result = result.slice(0, options.limit);
  }

  return result;
}