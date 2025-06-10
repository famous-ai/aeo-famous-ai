# Migration Guide: v0.1.0 → v1.0.0

## Breaking Changes Overview

Version 1.0.0 introduces a **complete architectural change** from coupled layout components to a true headless CMS with render props pattern.

## Before (v0.1.0)

```tsx
import { BlogArticleTemplate } from 'famous-ai';

<BlogArticleTemplate 
  blog={blog}
  className="my-styles"
  contentClassName="my-content"
  basePath="/blog"
/>
```

## After (v1.0.0)

```tsx
import { BlogArticleTemplate } from 'famous-ai';

<BlogArticleTemplate 
  blog={blog}
  renderLayout={(content, blog) => (
    <div className="my-custom-layout">
      <h1>{blog.title}</h1>
      {content}
    </div>
  )}
  renderFAQ={(faqs) => (
    <div className="my-faq-styles">
      {faqs.map((faq, index) => (
        <details key={index}>
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  )}
/>
```

## New Features

- **Table of Contents**: `renderTOC` prop for navigation
- **Key Insights**: `renderInsights` prop for highlights  
- **FAQs**: `renderFAQ` prop for structured Q&A
- **Enhanced SEO**: Automatic FAQ structured data

## CSS Changes

All CSS styles have been removed. You now control 100% of the styling through your render props.

## Benefits

✅ Works with any design system (Tailwind, Material-UI, etc.)  
✅ Perfect TypeScript support  
✅ Enhanced SEO with structured data  
✅ True headless architecture  

## Migration Steps

1. Update package: `npm install famous-ai@1.0.0`
2. Replace old `BlogArticleTemplate` usage with render props
3. Implement your own styling in render functions
4. Use new enhanced features (TOC, FAQ, Insights) as needed

See `examples/next-app/blog-example.tsx` for complete implementation examples.