# Famous AI Blog with Next.js App Router

This guide explains how to implement Famous AI blog components in your Next.js application using the App Router.

## Getting Started

1. Install the Famous AI package:

```bash
npm install famous-ai
```

2. Set up your Next.js application with App Router (if you haven't already):

```bash
npx create-next-app@latest my-app --app
```

## Basic Implementation

### 1. Import CSS

First, include the Famous AI styles in your root layout:

```tsx
// app/layout.tsx
import 'famous-ai/dist/index.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2. Create Blog List Page

```tsx
// app/blog/page.tsx
import { BlogArticlesTemplate, fetchBlogs } from 'famous-ai';

export const revalidate = 3600; // Revalidate every hour (optional)

export default async function BlogPage() {
  // Fetch data during build
  const response = await fetchBlogs();
  const blogs = response?.blogs || [];

  return (
    <BlogArticlesTemplate
      blogs={blogs}
      loading={false}
      basePath="/blog"
    />
  );
}
```

### 3. Create Blog Detail Page

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { BlogArticleTemplate, fetchBlogs, fetchBlogBySlug } from 'famous-ai';

// Generate static paths at build time
export async function generateStaticParams() {
  const response = await fetchBlogs();
  const blogs = response?.blogs || [];
  
  return blogs.map((blog) => ({
    slug: blog.technical_data.url_data.slug,
  }));
}

export const revalidate = 3600; // Revalidate every hour (optional)

export default async function BlogPage({ params }: { params: { slug: string } }) {
  // Fetch specific blog by slug at build time
  const blog = await fetchBlogBySlug(params.slug);
  
  // If blog not found, show 404
  if (!blog) {
    notFound();
  }

  return (
    <BlogArticleTemplate
      blog={blog}
      loading={false}
      basePath="/blog"
      homePath="/"
    />
  );
}
```

## Enhanced Implementation

### Add Metadata for SEO

App Router provides a powerful metadata API:

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await fetchBlogBySlug(params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }
  
  return {
    title: blog.title,
    description: blog.technical_data.metadata.core.description,
    openGraph: {
      title: blog.technical_data.metadata.open_graph.title,
      description: blog.technical_data.metadata.open_graph.description,
    },
  };
}
```

### Customizing the Layout

You can create a specific layout for your blog section:

```tsx
// app/blog/layout.tsx
import 'famous-ai/dist/index.css';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-container">
      <h1 className="blog-header">Our Blog</h1>
      {children}
    </div>
  );
}
```

## Data Fetching Options

### Static Rendering (Default)

The examples above use static rendering with optional revalidation. This is ideal for most blog implementations.

### Dynamic Rendering

For completely dynamic content:

```tsx
// app/blog/page.tsx
export const dynamic = 'force-dynamic';
```

### Incremental Static Regeneration (ISR)

To update content periodically:

```tsx
// app/blog/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

## Environment Configuration

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_API_BASE_URL=https://your-api-base-url.com
```

## Full Example

See the `examples/next-app/famous-ai` directory for a complete working example with:

- Blog listing page
- Individual blog pages with dynamic routes
- Layout customization
- Metadata configuration

## Support

If you encounter any issues, please contact our support team.