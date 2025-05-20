// Export Blog components
export { BlogArticlesTemplate } from './lib/BlogArticlesTemplate';
export { BlogArticleTemplate } from './lib/BlogArticleTemplate';

// Export Blog utilities
export {
  fetchBlogs,
  fetchBlogBySlug,
  fetchBlogById
} from './lib/fetchBlogs';
export { convertBlogToNextMetadata } from './lib/metadataConverter';

// Export Blog types
export type { BlogArticlesTemplateProps } from './lib/BlogArticlesTemplate';
export type { BlogArticleTemplateProps } from './lib/BlogArticleTemplate';
export type { FetchBlogsConfig, FetchBlogsOptions } from './lib/fetchBlogs';
export type {
  Blog,
  BlogResponse,
  TechnicalData,
  MetadataStructure,
  ContentStructure
} from './types/blog-types';

// Export CSS
import './styles/blog.css';