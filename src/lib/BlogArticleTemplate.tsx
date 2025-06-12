import React from 'react';
import * as cheerio from 'cheerio';
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
 * Parse HTML content to extract headings and inject IDs for TOC using Cheerio
 */
export function parseContentForTOC(htmlContent: string): {
  modifiedContent: string;
  tableOfContents: TOCItem[];
} {
  // Handle edge cases
  if (!htmlContent) {
    return { modifiedContent: '', tableOfContents: [] };
  }

  const toc: TOCItem[] = [];
  const usedIds = new Set<string>();

  try {
    // Load HTML with Cheerio - be permissive with malformed HTML
    const $ = cheerio.load(htmlContent, {
      xml: false, // HTML mode for better compatibility
    });

    // Find only h1 and h2 elements for cleaner TOC (avoid overwhelming depth)
    const headings = $('h1, h2');

    if (headings.length === 0) {
      return { modifiedContent: htmlContent, tableOfContents: [] };
    }

    headings.each((_, element) => {
      const $heading = $(element);
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(tagName.substring(1)); // Extract number from h1, h2

      // Get clean text content (strip nested HTML but preserve text)
      const cleanTitle = $heading.text().trim();

      if (!cleanTitle) {
        return; // Skip headings with no text content
      }

      // Check if heading already has an ID
      let id = $heading.attr('id');

      if (!id) {
        // Generate new ID from text content
        let baseId = slugify(cleanTitle);

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
        $heading.attr('id', id);
      }

      usedIds.add(id);

      // Add to TOC
      toc.push({
        id,
        title: cleanTitle,
        anchor: `#${id}`,
        level,
      });
    });

    // Smart content extraction - get only the relevant content without HTML/head/body wrappers
    let modifiedContent: string;
    
    // Try to extract just the body content first
    const bodyContent = $('body').html();
    if (bodyContent) {
      modifiedContent = bodyContent;
    } else {
      // Fallback: get the root content, but avoid full document structure
      const rootElements = $.root().children();
      if (rootElements.length > 0) {
        modifiedContent = rootElements.map((_, el) => $(el).prop('outerHTML')).get().join('');
      } else {
        // Last resort: use $.html() but this might include wrappers
        modifiedContent = $.html();
      }
    }

    return {
      modifiedContent,
      tableOfContents: toc,
    };
  } catch (error) {
    // Fallback: return original content if parsing fails
    console.warn('Failed to parse HTML content for TOC:', error);
    return { modifiedContent: htmlContent, tableOfContents: [] };
  }
}

/**
 * Debug utility for troubleshooting TOC generation issues
 * Use this in your Next.js component to see exactly what's happening
 */
export function debugTOCGeneration(htmlContent: string, environment = 'unknown'): {
  input: {
    contentLength: number;
    hasH1: boolean;
    hasH2: boolean;
    preview: string;
  };
  output: {
    tocCount: number;
    contentModified: boolean;
    firstTocItem?: { id: string; title: string; level: number };
    modifiedPreview: string;
  };
  error?: string;
} {
  console.log(`🔍 TOC Debug - Environment: ${environment}`);
  
  const input = {
    contentLength: htmlContent?.length || 0,
    hasH1: htmlContent?.includes('<h1') || false,
    hasH2: htmlContent?.includes('<h2') || false,
    preview: htmlContent?.substring(0, 200) || '',
  };
  
  console.log('📥 Input:', input);
  
  try {
    const result = parseContentForTOC(htmlContent);
    
    const output = {
      tocCount: result.tableOfContents.length,
      contentModified: result.modifiedContent !== htmlContent,
      firstTocItem: result.tableOfContents[0],
      modifiedPreview: result.modifiedContent.substring(0, 200),
    };
    
    console.log('📤 Output:', output);
    console.log('🎯 TOC Items:', result.tableOfContents);
    
    if (output.contentModified) {
      console.log('✅ Content was modified (IDs injected)');
    } else {
      console.log('❌ Content unchanged - this is the bug!');
    }
    
    return { input, output };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('💥 TOC Generation Error:', errorMessage);
    
    return {
      input,
      output: {
        tocCount: 0,
        contentModified: false,
        modifiedPreview: '',
      },
      error: errorMessage,
    };
  }
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
    faqs:
      blog.faqs ||
      blog.technical_data?.schemas?.faq?.mainEntity?.map((item) => ({
        question: item.name,
        answer: item.acceptedAnswer.text,
      })) ||
      [],

    // Use provided TOC or parsed TOC from HTML content
    tableOfContents: blog.tableOfContents || parsedTOC,

    // Use provided insights or empty array
    keyInsights: blog.keyInsights || [],

    // Return content with injected heading IDs
    modifiedContent,
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
      <a href={homePath} style={{ color: '#0070f3', textDecoration: 'none' }}>
        Home
      </a>
      {' > '}
      <a href={basePath} style={{ color: '#0070f3', textDecoration: 'none' }}>
        Blog
      </a>
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
  const metadataComponent =
    !shouldHideMetadata && blog.published_at ? (
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '2rem' }}>
        Published: {new Date(blog.published_at).toLocaleDateString()}
        {blog.updated_at && blog.updated_at !== blog.published_at && (
          <> | Updated: {new Date(blog.updated_at).toLocaleDateString()}</>
        )}
      </div>
    ) : null;

  // Build base content using modified HTML with injected heading IDs
  const baseContent = <div dangerouslySetInnerHTML={{ __html: enhanced.modifiedContent }} />;

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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>{fullContent}</div>
  );
};
