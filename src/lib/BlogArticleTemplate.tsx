 import React from 'react';
import { Blog, TOCItem, InsightItem, SimpleFAQItem } from '../types/blog-types';

/**
 * Convert text to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Parse HTML content to extract headings and inject IDs for TOC
 */
function parseContentForTOC(htmlContent: string): {
  modifiedContent: string;
  tableOfContents: TOCItem[];
} {
  const headingRegex = /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
  const toc: TOCItem[] = [];
  const usedIds = new Set<string>();
  
  let modifiedContent = htmlContent;
  let match;
  
  // Reset regex for iteration
  headingRegex.lastIndex = 0;
  
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const [fullMatch, tagName, attributes, textContent] = match;
    const level = parseInt(tagName.substring(1)); // Extract number from h1, h2, etc.
    
    // Check if heading already has an ID
    const existingIdMatch = attributes.match(/id=["']([^"']+)["']/);
    let id: string;
    
    if (existingIdMatch) {
      // Use existing ID
      id = existingIdMatch[1];
    } else {
      // Generate new ID from text content (strip HTML tags)
      const cleanText = textContent.replace(/<[^>]*>/g, '').trim();
      let baseId = slugify(cleanText);
      
      // Handle empty or invalid slugs
      if (!baseId) {
        baseId = `heading-${level}`;
      }
      
      // Ensure unique ID
      let uniqueId = baseId;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      
      id = uniqueId;
      
      // Inject ID into the heading
      const newAttributes = attributes.trim() ? `${attributes} id="${id}"` : ` id="${id}"`;
      const newHeading = `<${tagName}${newAttributes}>${textContent}</${tagName}>`;
      modifiedContent = modifiedContent.replace(fullMatch, newHeading);
    }
    
    usedIds.add(id);
    
    // Add to TOC (strip HTML from title)
    const cleanTitle = textContent.replace(/<[^>]*>/g, '').trim();
    if (cleanTitle) {
      toc.push({
        id,
        title: cleanTitle,
        anchor: `#${id}`,
        level
      });
    }
  }
  
  return {
    modifiedContent,
    tableOfContents: toc
  };
}

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
  modifiedContent: string;
} {
  // Parse HTML content for TOC and inject IDs
  const { modifiedContent, tableOfContents: parsedTOC } = parseContentForTOC(blog.content);
  
  return {
    // Extract FAQs from existing schema or use provided faqs
    faqs: blog.faqs || 
      blog.technical_data?.schemas?.faq?.mainEntity?.map(item => ({
        question: item.name,
        answer: item.acceptedAnswer.text
      })) || [],
    
    // Use provided TOC or parsed TOC from HTML content
    tableOfContents: blog.tableOfContents || parsedTOC,
    
    // Use provided insights or empty array
    keyInsights: blog.keyInsights || [],
    
    // Return content with injected heading IDs
    modifiedContent
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

  // Build base content using modified HTML with injected heading IDs
  const baseContent = (
    <div dangerouslySetInnerHTML={{ __html: enhanced.modifiedContent }} />
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