# Famous AI - Headless CMS for Next.js

A truly headless CMS SDK for Next.js with flexible render props pattern. Fetches structured content from your API and gives you complete control over presentation.

## Installation

```bash
npm install famous-ai
# or
yarn add famous-ai
```

## ✨ Features

- **🎨 True Headless**: Complete design control through render props or selective hiding
- **📊 Enhanced Content**: Auto-generated Table of Contents (H1/H2), FAQ sections, Key Insights
- **🔗 Working TOC Navigation**: Automatically injects heading IDs for anchor navigation
- **🔍 SEO Optimized**: Automatic structured data, FAQ schema, metadata conversion
- **⚡ SSG Ready**: Built for Next.js App Router with static generation support
- **🛠️ Flexible API**: Three usage modes - standalone, selective, or full control
- **🎯 TypeScript**: Full type safety with exported interfaces
- **🚀 Zero Duplication**: Smart control props prevent layout conflicts
- **🐛 Debug Tools**: Built-in utilities for troubleshooting TOC issues

## 🚀 Quick Start - Three Usage Modes

### Mode 1: Standalone (Easiest)
```tsx
// Works immediately with sensible defaults
<BlogArticleTemplate blog={blog} />
```

### Mode 2: Selective Control (Recommended)
```tsx
// Prevent duplication while keeping enhanced features
<div className="my-layout">
  <h1>{blog.title}</h1> {/* Your custom title */}
  
  <BlogArticleTemplate 
    blog={blog}
    hideTitle={true}        // Hide SDK title to prevent duplication
    hideBreadcrumb={true}   // Use your own navigation
    
    // Enhanced content with your styling
    renderTOC={(toc) => (
      <nav className="my-toc">
        {toc.map(item => (
          <a key={item.id} href={item.anchor}>{item.title}</a>
        ))}
      </nav>
    )}
    
    renderFAQ={(faqs) => (
      <div className="my-faq">
        {faqs.map((faq, i) => (
          <details key={i}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    )}
  />
</div>
```

### Mode 3: Full Control (Advanced)
```tsx
<BlogArticleTemplate 
  blog={blog}
  renderLayout={(content, blog) => (
    <div className="completely-custom">
      <header>{blog.title}</header>
      {content}
      <footer>Custom footer</footer>
    </div>
  )}
/>
```

## 📋 Complete Next.js Setup

### Enhanced Metadata with Auto-SEO
```tsx
// app/blog/[slug]/page.tsx
import { convertBlogToNextMetadata } from 'famous-ai';

export async function generateMetadata({ params }) {
  const blog = await fetchBlogBySlug(params.slug);
  // Automatically includes FAQ structured data for SEO!
  return convertBlogToNextMetadata(blog);
}
```

### Static Generation
```tsx
export async function generateStaticParams() {
  const response = await fetchBlogs();
  return response.blogs.map(blog => ({
    slug: blog.technical_data.url_data.slug
  }));
}

export default async function BlogPage({ params }) {
  const blog = await fetchBlogBySlug(params.slug);
  
  return (
    <BlogArticleTemplate 
      blog={blog} 
      hideHeader={true}  // Perfect for custom layouts
    />
  );
}
```

## 📚 API Reference

### BlogArticleTemplate Props

```tsx
interface BlogArticleTemplateProps {
  blog: Blog | null;
  loading?: boolean;
  basePath?: string;
  homePath?: string;
  
  // Control what SDK renders
  hideTitle?: boolean;        // Hide article title
  hideBreadcrumb?: boolean;   // Hide breadcrumb nav  
  hideMetadata?: boolean;     // Hide author/date
  hideHeader?: boolean;       // Hide all header elements
  
  // Enhanced content render props
  renderTOC?: (toc: TOCItem[]) => React.ReactNode;
  renderInsights?: (insights: InsightItem[]) => React.ReactNode;
  renderFAQ?: (faqs: SimpleFAQItem[]) => React.ReactNode;
  
  // Layout control
  renderLayout?: (content: React.ReactNode, blog: Blog) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderError?: () => React.ReactNode;
}
```

### Enhanced Content Types

```tsx
interface TOCItem {
  id: string;           // Unique identifier  
  title: string;        // Clean heading text
  anchor: string;       // "#heading-id" for navigation
  level: number;        // 1-6 for h1-h6
}

interface SimpleFAQItem {
  question: string;
  answer: string;
}

interface InsightItem {
  content: string;
}
```

### Utility Functions

- `fetchBlogs()`: Fetch all blog articles
- `fetchBlogBySlug(slug)`: Fetch specific blog by slug
- `fetchBlogById(id)`: Fetch specific blog by ID  
- `convertBlogToNextMetadata(blog)`: Convert to Next.js Metadata with SEO
- `debugTOCGeneration(content, env)`: Debug TOC issues (development only)

## 🔄 Migrating from v0.1.0

See `MIGRATION.md` for complete upgrade guide. Quick summary:

```tsx
// Before (v0.1.0)
<BlogArticleTemplate blog={blog} className="my-styles" />

// After (v1.0.0) - Mode 2: Selective Control
<BlogArticleTemplate blog={blog} hideTitle={true} />
```

## 🎯 Key Features Deep Dive

### Auto-Generated Table of Contents
- **Smart Parsing**: Extracts H1 and H2 headings only (cleaner TOC)
- **Working Navigation**: Automatically injects `id` attributes for anchor links
- **Clean URLs**: Generates SEO-friendly slugs (e.g., "Introduction" → `#introduction`)
- **Duplicate Handling**: Ensures unique IDs even with duplicate headings
- **SSR Compatible**: Works in Next.js server and client environments

### FAQ Structured Data  
- Automatic schema.org FAQ markup for SEO
- Extracts from existing blog data or custom FAQ fields
- Boosts search engine visibility and rich snippets

### Flexible Architecture
- **Standalone**: Zero configuration, works immediately  
- **Selective**: Hide specific elements to prevent duplication
- **Full Control**: Complete layout customization through render props

## 📁 Examples

See `examples/next-app/blog-example.tsx` for all three usage modes:
- Standalone implementation
- Selective control with custom layouts  
- Full render props customization
- TypeScript examples with proper typing

## 🐛 Troubleshooting TOC Issues

If TOC links aren't working, use the debug utility:

```tsx
'use client';
import { useEffect } from 'react';
import { debugTOCGeneration } from 'famous-ai';

export default function BlogPage({ blog }) {
  useEffect(() => {
    if (blog?.content && process.env.NODE_ENV === 'development') {
      debugTOCGeneration(blog.content, 'Next.js Client');
    }
  }, [blog]);

  return <BlogArticleTemplate blog={blog} />;
}
```

This will log detailed information about:
- Input content analysis (length, heading detection)
- Parsing results (TOC count, ID injection status) 
- Any errors in the generation process

**Common Issues:**
- **No headings found**: Content might not contain `<h1>` or `<h2>` tags
- **IDs not injected**: Content parsing failed - check browser console
- **Links don't scroll**: Ensure you're using the latest version

## 🚀 Environment Variables

Create `.env.local` with your API configuration:

```env
FAMOUS_AI_API_KEY=your_api_key
FAMOUS_AI_API_BASE_URL=https://your-api-base-url.com
```

## License

MIT License - Build amazing headless blogs! 🎉