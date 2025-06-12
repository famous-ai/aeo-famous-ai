# Migration Guide: v0.1.0 → v1.0.0

## Breaking Changes Overview

Version 1.0.0 introduces a **hybrid approach** - works standalone with sensible defaults OR allows selective customization to prevent duplication.

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

## After (v1.0.0) - Three Usage Modes

### Mode 1: Standalone (Easiest Migration)
```tsx
// Works immediately with default styling
<BlogArticleTemplate blog={blog} />
```

### Mode 2: Selective Control (Recommended)
```tsx
// Hide SDK elements to prevent duplication
<div className="my-layout">
  <h1>{blog.title}</h1>  {/* Your title */}
  
  <BlogArticleTemplate 
    blog={blog}
    hideTitle={true}        // Hide SDK title
    hideBreadcrumb={true}   // Hide SDK breadcrumb
    renderFAQ={(faqs) => (
      <div className="my-faq-design">
        {faqs.map((faq, index) => (
          <details key={index}>
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
      {content}
    </div>
  )}
/>
```

## New Features

- **Control Props**: `hideTitle`, `hideBreadcrumb`, `hideMetadata`, `hideHeader`
- **Table of Contents**: `renderTOC` prop for navigation
- **Key Insights**: `renderInsights` prop for highlights  
- **FAQs**: `renderFAQ` prop with automatic SEO structured data
- **Default Styling**: Works out of the box with minimal inline styles

## Solving Title Duplication

```tsx
// OLD PROBLEM: Multiple titles
<h1>{blog.title}</h1>           // Your title
<BlogArticleTemplate blog={blog} />  // SDK also renders title

// NEW SOLUTION: Hide SDK title
<h1>{blog.title}</h1>           // Your title
<BlogArticleTemplate 
  blog={blog} 
  hideTitle={true}              // SDK won't render title
/>
```

## Migration Steps

1. **Quick Migration**: Just remove `className` props - component works standalone
2. **Prevent Duplication**: Add `hideTitle={true}`, `hideBreadcrumb={true}` as needed  
3. **Enhanced Features**: Add `renderFAQ`, `renderTOC` for rich content
4. **Full Customization**: Use `renderLayout` if you need complete control

See `examples/next-app/blog-example.tsx` for all three modes demonstrated.