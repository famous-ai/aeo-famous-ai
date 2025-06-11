// Export Blog components
export { BlogArticlesTemplate } from './lib/BlogArticlesTemplate';
export { BlogArticleTemplate } from './lib/BlogArticleTemplate';

// Export Blog utilities
export { fetchBlogs, fetchBlogBySlug, fetchBlogById } from './lib/fetchBlogs';
export { convertBlogToNextMetadata } from './lib/metadataConverter';

// Export internal utilities for testing/debugging
export { parseContentForTOC, debugTOCGeneration } from './lib/BlogArticleTemplate';

// Export Blog types
export type { BlogArticlesTemplateProps } from './lib/BlogArticlesTemplate';
export type { BlogArticleTemplateProps } from './lib/BlogArticleTemplate';
export type { FetchBlogsConfig, FetchBlogsOptions } from './lib/fetchBlogs';
export type {
  Blog,
  BlogResponse,
  TechnicalData,
  MetadataStructure,
  ContentStructure,
  TOCItem,
  InsightItem,
  SimpleFAQItem,
} from './types/blog-types';

// Export CSS
import './styles/blog.css';
