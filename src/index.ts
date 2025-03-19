// Export components
export { FAQRenderer } from './components/FAQRenderer';
export { FAQAccordion } from './components/FAQAccordion';
export { FAQSearch } from './components/FAQSearch';

// Export utilities
export { fetchFaqs } from './lib/fetchFaqs';
export { generateStaticFAQ } from './lib/generateStaticFAQ';
export { customizeFAQ } from './lib/customizeFAQ';
export { useClientFAQ } from './lib/useClientFAQ';

// Export types
export type { 
  FAQ, 
  FAQResponse, 
  FetchOptions, 
  FAQRendererProps 
} from './types';
export type { FAQTransformOptions } from './lib/customizeFAQ';
export type { UseClientFAQOptions, UseClientFAQResult } from './lib/useClientFAQ';

// Export CSS
import './styles/faq.css';