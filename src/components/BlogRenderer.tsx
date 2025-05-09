import React from 'react';
import { Blog } from '../types/blog-types';

export interface BlogRendererProps {
  /**
   * Blog data to be rendered
   */
  blog: Blog;
  
  /**
   * Custom CSS class for the blog container
   */
  className?: string;
  
  /**
   * Custom CSS class for the blog title
   */
  titleClassName?: string;
  
  /**
   * Custom CSS class for the blog content
   */
  contentClassName?: string;
  
  /**
   * Whether to include JSON-LD structured data
   */
  includeJsonLd?: boolean;
  
  /**
   * Custom renderer for the blog title
   */
  titleRenderer?: (blog: Blog) => React.ReactNode;
  
  /**
   * Custom renderer for the blog content
   */
  contentRenderer?: (blog: Blog) => React.ReactNode;
  
  /**
   * Custom renderer for the blog date
   */
  dateRenderer?: (blog: Blog) => React.ReactNode;
}

/**
 * A component for rendering a blog post
 */
export const BlogRenderer: React.FC<BlogRendererProps> = ({
  blog,
  className = 'famousai-blog',
  titleClassName = 'famousai-blog-title',
  contentClassName = 'famousai-blog-content',
  includeJsonLd = true,
  titleRenderer,
  contentRenderer,
  dateRenderer,
}) => {
  // Generate structured data for the blog
  const generateJsonLd = () => {
    const { schemas } = blog.technical_data;
    
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      description: blog.technical_data.metadata.core.description,
      author: schemas.article.author,
      publisher: schemas.article.publisher,
      datePublished: blog.published_at,
      dateModified: blog.updated_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': blog.technical_data.url_data.canonical_url,
      },
    };
    
    return JSON.stringify(articleSchema);
  };

  // Default title renderer
  const defaultTitleRenderer = () => (
    <h1 className={titleClassName}>{blog.title}</h1>
  );

  // Default content renderer
  const defaultContentRenderer = () => (
    <div 
      className={contentClassName} 
      dangerouslySetInnerHTML={{ __html: blog.content }}
    />
  );

  // Default date renderer
  const defaultDateRenderer = () => (
    blog.published_at && (
      <div className="famousai-blog-date">
        Published: {new Date(blog.published_at).toLocaleDateString()}
      </div>
    )
  );

  return (
    <article className={className}>
      {/* Structured data if enabled */}
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateJsonLd() }}
        />
      )}
      
      {/* Blog title */}
      {titleRenderer ? titleRenderer(blog) : defaultTitleRenderer()}
      
      {/* Blog date */}
      {dateRenderer ? dateRenderer(blog) : defaultDateRenderer()}
      
      {/* Blog content */}
      {contentRenderer ? contentRenderer(blog) : defaultContentRenderer()}
    </article>
  );
};