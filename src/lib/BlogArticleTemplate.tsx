import React from 'react';
import { Blog, TOCItem, InsightItem, SimpleFAQItem } from '../types/blog-types';

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
   * Base path for blog links
   */
  basePath?: string;

  /**
   * Home page path
   */
  homePath?: string;

  // Control what SDK renders (selective hiding)
  /**
   * Hide the article title - parent will handle it
   */
  hideTitle?: boolean;

  /**
   * Hide the breadcrumb navigation - parent will handle it
   */
  hideBreadcrumb?: boolean;

  /**
   * Hide the metadata (author, date) - parent will handle it
   */
  hideMetadata?: boolean;

  /**
   * Hide all header elements (breadcrumb + title + metadata)
   */
  hideHeader?: boolean;

  // Enhanced content render props
  /**
   * Optional: Render table of contents when available
   */
  renderTOC?: (toc: TOCItem[]) => React.ReactNode;

  /**
   * Optional: Render key insights when available
   */
  renderInsights?: (insights: InsightItem[]) => React.ReactNode;

  /**
   * Optional: Render FAQs when available
   */
  renderFAQ?: (faqs: SimpleFAQItem[]) => React.ReactNode;

  // Optional layout wrapper
  /**
   * Optional: Wrapper for entire content - if not provided, uses default layout
   */
  renderLayout?: (content: React.ReactNode, blog: Blog) => React.ReactNode;

  // Custom state renderers
  /**
   * Optional: Loading state renderer
   */
  renderLoading?: () => React.ReactNode;

  /**
   * Optional: Error state renderer
   */
  renderError?: () => React.ReactNode;
}

/**
 * Extract enhanced content from blog data with fault tolerance
 */
function extractEnhancedContent(blog: Blog): {
  faqs: SimpleFAQItem[];
  tableOfContents: TOCItem[];
  keyInsights: InsightItem[];
} {
  return {
    // Extract FAQs from existing schema or use provided faqs
    faqs: blog.faqs || 
      blog.technical_data?.schemas?.faq?.mainEntity?.map(item => ({
        question: item.name,
        answer: item.acceptedAnswer.text
      })) || [],
    
    // Build TOC from content structure or use provided TOC
    tableOfContents: blog.tableOfContents ||
      blog.technical_data?.content_structure?.sections?.flatMap(section => [
        { id: section.id, title: section.h2, anchor: `#${section.id}`, level: 2 },
        ...(section.children?.map(child => ({
          id: child.id, title: child.h3, anchor: `#${child.id}`, level: 3
        })) || [])
      ]) || [],
    
    // Use provided insights or empty array
    keyInsights: blog.keyInsights || []
  };
}

/**
 * A template component for rendering a single blog article
 */
export const BlogArticleTemplate: React.FC<BlogArticleTemplateProps> = ({
  blog,
  loading = false,
  basePath = '/blog',
  homePath = '/',
  hideTitle = false,
  hideBreadcrumb = false,
  hideMetadata = false,
  hideHeader = false,
  renderTOC,
  renderInsights,
  renderFAQ,
  renderLayout,
  renderLoading,
  renderError,
}) => {
  // Handle loading state
  if (loading) {
    return renderLoading ? renderLoading() : <div>Loading...</div>;
  }

  // Handle error state
  if (!blog) {
    return renderError ? renderError() : <div>Blog not found</div>;
  }

  // Extract enhanced content with fault tolerance
  const enhanced = extractEnhancedContent(blog);

  // Check if header should be hidden (hideHeader overrides individual flags)
  const shouldHideBreadcrumb = hideHeader || hideBreadcrumb;
  const shouldHideTitle = hideHeader || hideTitle;
  const shouldHideMetadata = hideHeader || hideMetadata;

  // Build default breadcrumb component
  const breadcrumbComponent = !shouldHideBreadcrumb ? (
    <nav style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>
      <a href={homePath} style={{ color: '#0070f3', textDecoration: 'none' }}>Home</a>
      {' > '}
      <a href={basePath} style={{ color: '#0070f3', textDecoration: 'none' }}>Blog</a>
      {' > '}
      <span>{blog.title}</span>
    </nav>
  ) : null;

  // Build default title component
  const titleComponent = !shouldHideTitle ? (
    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: '#333' }}>
      {blog.title}
    </h1>
  ) : null;

  // Build default metadata component
  const metadataComponent = !shouldHideMetadata && blog.published_at ? (
    <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '2rem' }}>
      Published: {new Date(blog.published_at).toLocaleDateString()}
      {blog.updated_at && blog.updated_at !== blog.published_at && (
        <> | Updated: {new Date(blog.updated_at).toLocaleDateString()}</>
      )}
    </div>
  ) : null;

  // Build base content
  const baseContent = (
    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
  );

  // Build enhanced content sections
  const enhancedSections = (
    <>
      {enhanced.tableOfContents.length > 0 && renderTOC && renderTOC(enhanced.tableOfContents)}
      {enhanced.keyInsights.length > 0 && renderInsights && renderInsights(enhanced.keyInsights)}
      {enhanced.faqs.length > 0 && renderFAQ && renderFAQ(enhanced.faqs)}
    </>
  );

  // Combine all content
  const fullContent = (
    <>
      {breadcrumbComponent}
      <article>
        {titleComponent}
        {metadataComponent}
        {baseContent}
        {enhancedSections}
      </article>
    </>
  );

  // Use custom layout if provided, otherwise use default
  if (renderLayout) {
    return <>{renderLayout(fullContent, blog)}</>;
  }

  // Default layout wrapper
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      {fullContent}
    </div>
  );
};