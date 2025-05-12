export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQResponse {
  faqs: FAQ[];
}

export interface FetchOptions {
  /** API endpoint URL to fetch FAQ data */
  apiUrl: string;
  /** Optional headers to include in the request */
  headers?: Record<string, string>;
}

export interface FAQRendererProps {
  /** Array of FAQ items to render */
  faqs: FAQ[];
  /** Optional CSS class name for styling */
  className?: string;
}