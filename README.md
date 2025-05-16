# Famous AI - Headless CMS for Next.js

A headless CMS package for Next.js that fetches and renders Blog data from your API, optimized for the App Router architecture and static site generation.

## Installation

```bash
npm install famous-ai
# or
yarn add famous-ai
```

## Features

- **Blog Components**: Ready-to-use components for displaying blog listings and individual articles
- **Static Site Generation**: Built for Next.js App Router with static generation support
- **Automatic Styling**: CSS is included and applied to components
- **API Integration**: Simple utilities for fetching data from your backend
- **SEO Optimization**: Metadata API support for improved SEO

## Usage with Next.js App Router

### 1. Import CSS

Include the styles in your root layout:

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

### 2. Blog List Page (Static Generation)

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

### 3. Blog Detail Page (Static Generation with Dynamic Routes)

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { BlogArticleTemplate, fetchBlogs, fetchBlogBySlug } from 'famous-ai';
import { Metadata } from 'next';

// Generate metadata for each blog post (optional but recommended for SEO)
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

## API Reference

### Components

- `BlogArticlesTemplate`: Renders a list of blog articles
- `BlogArticleTemplate`: Renders a single blog article

### Utility Functions

- `fetchBlogs`: Fetches all blog articles from your API
- `fetchBlogBySlug`: Fetches a specific blog article by its slug
- `fetchBlogById`: Fetches a specific blog article by its ID

### Types

- `Blog`: Interface for blog article data
- `BlogResponse`: Interface for API response containing blogs
- `FetchBlogsConfig`: Configuration options for API requests
- `BlogArticlesTemplateProps`: Props for the BlogArticlesTemplate component
- `BlogArticleTemplateProps`: Props for the BlogArticleTemplate component

## Environment Variables

Create a `.env.local` file with your API configuration:

```
FAMOUS_AI_API_KEY=your_api_key
FAMOUS_AI_API_BASE_URL=https://your-api-base-url.com
```

## Examples

See the `examples/next-app` directory for a complete working example with:
- App Router implementation with static site generation
- Dynamic routes with metadata for SEO
- Proper directory structure and configuration

## License

MIT