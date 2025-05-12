# Blog Component Usage Guide

This guide explains how to use the Famous AI blog components to quickly add a blog to your Next.js application.

## Installation

```bash
npm install aeo-famous-ai
```

## Environment Setup

Create or update your `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
NEXT_PUBLIC_API_KEY=your-api-key
```

## CSS Styles

The package automatically includes all required CSS styles, so you don't need to import them separately. Styles are bundled with the components and will be applied automatically when you use them.

If you're using Next.js, the styles will work immediately without any additional configuration.

## Blog List Page

Create a page to list all blog articles:

```tsx
// app/blog/page.tsx (App Router)
"use client";

import { useState, useEffect } from 'react';
import { BlogArticlesTemplate, fetchBlogs, Blog } from 'aeo-famous-ai';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const response = await fetchBlogs();
        if (response) {
          setBlogs(response.blogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, []);

  return (
    <BlogArticlesTemplate
      blogs={blogs}
      loading={loading}
      basePath="/blog"
    />
  );
}
```

## Single Blog Page

Create a page to display a single blog article:

```tsx
// app/blog/[slug]/page.tsx (App Router)
"use client";

import { useState, useEffect } from 'react';
import { BlogArticleTemplate, fetchBlogBySlug, Blog } from 'aeo-famous-ai';

export default function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const fetchedBlog = await fetchBlogBySlug(slug);
        setBlog(fetchedBlog);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, [slug]);

  return (
    <BlogArticleTemplate
      blog={blog}
      loading={loading}
      basePath="/blog"
      homePath="/"
    />
  );
}
```

## Server-Side Rendering (Optional)

For better SEO, you can use server-side rendering:

```tsx
// pages/blog/[slug].tsx (Pages Router)
import { GetServerSideProps } from 'next';
import { BlogArticleTemplate, fetchBlogBySlug, Blog } from 'aeo-famous-ai';

interface BlogPageProps {
  blog: Blog | null;
}

export default function BlogPage({ blog }: BlogPageProps) {
  return (
    <BlogArticleTemplate
      blog={blog}
      basePath="/blog"
      homePath="/"
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const blog = await fetchBlogBySlug(slug);
  
  return {
    props: {
      blog,
    },
  };
};
```

## Customization

### Custom Styling

The components come with default styling, but you can customize them:

```tsx
<BlogArticlesTemplate
  blogs={blogs}
  loading={loading}
  basePath="/blog"
  className="my-custom-container"
  titleClassName="my-custom-title"
  blogItemClassName="my-custom-blog-item"
  title="Our Latest Articles"
  readMoreText="Continue Reading"
/>
```

### Custom Renderers

You can provide custom renderers for blog items:

```tsx
<BlogArticlesTemplate
  blogs={blogs}
  blogItemRenderer={(blog, basePath) => (
    <div key={blog.id} className="my-custom-blog-card">
      <h3>{blog.title}</h3>
      <p>{blog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
      <a href={`${basePath}/${blog.technical_data.url_data.slug}`}>Read more</a>
    </div>
  )}
/>
```

For single blog articles:

```tsx
<BlogArticleTemplate
  blog={blog}
  contentRenderer={(blog) => (
    <div className="my-custom-content">
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  )}
/>
```

## API Configuration

You can manually configure the API settings:

```tsx
import { fetchBlogs, FetchBlogsConfig } from 'aeo-famous-ai';

const config: FetchBlogsConfig = {
  apiKey: 'your-api-key',
  apiBaseUrl: 'https://your-api-url.com',
  endpoint: 'api/v1/blogs'
};

// Fetch all blogs
const response = await fetchBlogs(config);

// Fetch a specific blog by slug
const blog = await fetchBlogBySlug('blog-slug', config);

// Fetch a specific blog by ID
const blog = await fetchBlogById(123, config);
```

## Component Props

### BlogArticlesTemplate Props

| Prop | Type | Description |
|------|------|-------------|
| blogs | Blog[] | Array of blog data to be rendered |
| loading | boolean | Loading state indicator |
| className | string | Custom CSS class for the container |
| titleClassName | string | Custom CSS class for the title |
| blogItemClassName | string | Custom CSS class for individual blog items |
| title | string | Custom title text |
| basePath | string | Base path for blog links |
| loadingMessage | string | Loading message to display |
| emptyMessage | string | Message to display when no blogs are found |
| blogItemRenderer | function | Custom renderer for individual blog items |
| readMoreText | string | "Read more" text for blog links |

### BlogArticleTemplate Props

| Prop | Type | Description |
|------|------|-------------|
| blog | Blog \| null | Blog data to be rendered |
| loading | boolean | Loading state indicator |
| className | string | Custom CSS class for the container |
| contentClassName | string | Custom CSS class for the content |
| basePath | string | Base path for blog links |
| homePath | string | Home page path |
| loadingMessage | string | Loading message to display |
| errorMessage | string | Error message when blog is not found |
| backLinkText | string | Text for the back to blogs link |
| includeBreadcrumbs | boolean | Whether to include breadcrumbs |
| includeJsonLd | boolean | Whether to include JSON-LD structured data |
| contentRenderer | function | Custom renderer for blog content |
| dateRenderer | function | Custom renderer for blog date |