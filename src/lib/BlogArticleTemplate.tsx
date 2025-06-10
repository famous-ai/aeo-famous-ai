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
   * Base path for blog links (for data extraction)
   */
  basePath?: string;

  /**
   * Home page path (for data extraction)
   */
  homePath?: string;

  /**
   * Required: Consumer controls entire layout and presentation
   */
  renderLayout: (content: React.ReactNode, blog: Blog) => React.ReactNode;

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
  renderLayout,
  renderTOC,
  renderInsights,
  renderFAQ,
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

  // Create base content
  const baseContent = (
    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
  );

  // Create enhanced content by combining base + optional enhancements
  const enhancedContent = (
    <>
      {baseContent}
      {enhanced.tableOfContents.length > 0 && renderTOC && renderTOC(enhanced.tableOfContents)}
      {enhanced.keyInsights.length > 0 && renderInsights && renderInsights(enhanced.keyInsights)}
      {enhanced.faqs.length > 0 && renderFAQ && renderFAQ(enhanced.faqs)}
    </>
  );

  // Let consumer control the entire layout
  return <>{renderLayout(enhancedContent, blog)}</>;
};