// Export components
export { FAQRenderer } from './components/FAQRenderer';
export { FAQAccordion } from './components/FAQAccordion';
export { FAQSearch } from './components/FAQSearch';
export { BlogRenderer } from './components/BlogRenderer';

// Export utilities
export { fetchFaqs } from './lib/fetchFaqs';
export { generateStaticFAQ } from './lib/generateStaticFAQ';
export { customizeFAQ } from './lib/customizeFAQ';
export { useClientFAQ } from './lib/useClientFAQ';

// Export Blog utilities
export { BlogClient } from './lib/blogClient';
export {
  generateStaticBlogPaths,
  generateStaticBlogProps,
  generateBlogMetadata,
  generateBlogJsonLd,
  defaultPathGenerator
} from './lib/generateStaticBlog';
export { BlogTemplate } from './lib/BlogTemplate';
export {
  generateBlogPaths,
  generateBlogProps,
  defaultBlogPathGenerator
} from './lib/generateBlogPages';

// Export types
export type {
  FAQ,
  FAQResponse,
  FetchOptions,
  FAQRendererProps
} from './types';
export type { FAQTransformOptions } from './lib/customizeFAQ';
export type { UseClientFAQOptions, UseClientFAQResult } from './lib/useClientFAQ';
export type { StaticBlogConfig } from './lib/generateStaticBlog';
export type { BlogRendererProps } from './components/BlogRenderer';
export type { BlogTemplateProps } from './lib/BlogTemplate';
export type { GenerateBlogPagesConfig } from './lib/generateBlogPages';
export type {
  Blog,
  BlogResponse,
  TechnicalData,
  MetadataStructure,
  ContentStructure
} from './types/blog-types';

// Export CSS
import './styles/faq.css';