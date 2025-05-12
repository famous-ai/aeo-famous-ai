import React from 'react';
import Link from 'next/link';
import { Blog } from '../types/blog-types';

export interface BlogArticleTemplateProps {
  /**
   * Blog data to be rendered
   */
  blog: Blog | null;

  /**
   * Loading state indicator
   */
  loading?: boolean;

  /**
   * Custom CSS class for the container
   */
  className?: string;

  /**
   * Custom CSS class for the content
   */
  contentClassName?: string;

  /**
   * Base path for blog links
   */
  basePath?: string;

  /**
   * Home page path
   */
  homePath?: string;

  /**
   * Loading message to display
   */
  loadingMessage?: string;

  /**
   * Error message when blog is not found
   */
  errorMessage?: string;

  /**
   * Text for the back to blogs link
   */
  backLinkText?: string;

  /**
   * Whether to include breadcrumbs
   */
  includeBreadcrumbs?: boolean;

  /**
   * Whether to include JSON-LD structured data
   */
  includeJsonLd?: boolean;

  /**
   * Custom renderer for blog content
   */
  contentRenderer?: (blog: Blog) => React.ReactNode;

  /**
   * Custom renderer for blog date
   */
  dateRenderer?: (blog: Blog) => React.ReactNode;
}

/**
 * A template component for rendering a single blog article
 */
export const BlogArticleTemplate: React.FC<BlogArticleTemplateProps> = ({
  blog,
  loading = false,
  className = 'famousai-blog-container',
  contentClassName = 'famousai-blog-content',
  basePath = '/blog',
  homePath = '/',
  loadingMessage = 'Loading blog article...',
  errorMessage = 'The requested blog article could not be found.',
  backLinkText = 'Back to all blogs',
  includeBreadcrumbs = true,
  includeJsonLd = true,
  contentRenderer,
  dateRenderer,
}) => {
  // Generate JSON-LD structured data
  const generateJsonLd = (blog: Blog) => {
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

  // Default content renderer
  const defaultContentRenderer = (blog: Blog) => (
    <div
      className={contentClassName}
      dangerouslySetInnerHTML={{ __html: blog.content }}
    />
  );

  // Default date renderer
  const defaultDateRenderer = (blog: Blog) => (
    blog.published_at && (
      <div className="famousai-blog-date">
        Published: {new Date(blog.published_at).toLocaleDateString()}
        {blog.updated_at && blog.updated_at !== blog.published_at && (
          <> | Updated: {new Date(blog.updated_at).toLocaleDateString()}</>
        )}
      </div>
    )
  );

  if (loading) {
    return (
      <div className={`${className} famousai-blog-loading`}>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`${className} famousai-blog-error`}>
        <h1 className="famousai-blog-error-title">Blog Not Found</h1>
        <p>{errorMessage}</p>
        <Link href={basePath} className="famousai-blog-back-link">
          {backLinkText}
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* JSON-LD structured data */}
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateJsonLd(blog)
          }}
        />
      )}

      {/* Breadcrumbs */}
      {includeBreadcrumbs && (
        <div className="famousai-blog-breadcrumbs">
          <Link href={homePath} className="famousai-breadcrumb-link">Home</Link>
          {' > '}
          <Link href={basePath} className="famousai-breadcrumb-link">Blog</Link>
          {' > '}
          <span>{blog.title}</span>
        </div>
      )}

      {/* Blog Content */}
      <article className="famousai-blog-article">
        <h1 className="famousai-blog-title">{blog.title}</h1>

        {/* Blog date */}
        {dateRenderer ? dateRenderer(blog) : defaultDateRenderer(blog)}

        {/* Blog content */}
        {contentRenderer ? contentRenderer(blog) : defaultContentRenderer(blog)}
      </article>

      {/* Back to blogs link */}
      <div className="famousai-blog-footer">
        <Link href={basePath} className="famousai-blog-back-link">
          ← {backLinkText}
        </Link>
      </div>
    </div>
  );
};