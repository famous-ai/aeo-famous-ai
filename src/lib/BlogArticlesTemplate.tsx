import React from 'react';
import Link from 'next/link';
import { Blog } from '../types/blog-types';

export interface BlogArticlesTemplateProps {
  /**
   * Array of blog data to be rendered
   */
  blogs: Blog[];

  /**
   * Loading state indicator
   */
  loading?: boolean;

  /**
   * Custom CSS class for the container
   */
  className?: string;

  /**
   * Custom CSS class for the title
   */
  titleClassName?: string;

  /**
   * Custom CSS class for individual blog items
   */
  blogItemClassName?: string;

  /**
   * Custom title text
   */
  title?: string;

  /**
   * Base path for blog links
   */
  basePath?: string;

  /**
   * Loading message to display
   */
  loadingMessage?: string;

  /**
   * Message to display when no blogs are found
   */
  emptyMessage?: string;

  /**
   * Custom renderer for individual blog items
   */
  blogItemRenderer?: (blog: Blog, basePath: string) => React.ReactNode;

  /**
   * "Read more" text for blog links
   */
  readMoreText?: string;
}

/**
 * A template component for rendering a list of blog articles
 */
export const BlogArticlesTemplate: React.FC<BlogArticlesTemplateProps> = ({
  blogs,
  loading = false,
  className = 'famousai-blogs-container',
  titleClassName = 'famousai-blogs-title',
  blogItemClassName = 'famousai-blog-item',
  title = 'Blog Articles',
  basePath = '/blog',
  loadingMessage = 'Loading blog articles...',
  emptyMessage = 'No blog articles found.',
  blogItemRenderer,
  readMoreText = 'Read more',
}) => {
  // Default renderer for individual blog items
  const defaultBlogItemRenderer = (blog: Blog, basePath: string) => (
    <article key={blog.id} className={blogItemClassName}>
      <h2 className="famousai-blog-item-title">
        <Link
          href={`${basePath}/${blog.technical_data.url_data.slug}`}
          className="famousai-blog-item-link"
        >
          {blog.title}
        </Link>
      </h2>

      {blog.published_at && (
        <div className="famousai-blog-item-date">
          Published: {new Date(blog.published_at).toLocaleDateString()}
        </div>
      )}

      <div className="famousai-blog-item-excerpt">
        {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
      </div>

      <Link
        href={`${basePath}/${blog.technical_data.url_data.slug}`}
        className="famousai-blog-item-read-more"
      >
        {readMoreText}
      </Link>
    </article>
  );

  return (
    <div className={className}>
      <h1 className={titleClassName}>{title}</h1>

      {loading ? (
        <div className="famousai-blogs-loading">
          <p>{loadingMessage}</p>
        </div>
      ) : (
        <div className="famousai-blogs-list">
          {blogs.length === 0 && <p className="famousai-blogs-empty">{emptyMessage}</p>}

          {blogs.map((blog) =>
            blogItemRenderer
              ? blogItemRenderer(blog, basePath)
              : defaultBlogItemRenderer(blog, basePath)
          )}
        </div>
      )}
    </div>
  );
};
