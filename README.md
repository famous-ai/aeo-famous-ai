# Famous AI - Headless CMS for Next.js

A headless CMS package for Next.js that fetches and renders Blog data from your API.

## Installation

```bash
npm install famous-ai
# or
yarn add famous-ai
```

## Features

- **Blog Components**: Ready-to-use components for displaying blog listings and individual articles
- **Automatic Styling**: CSS is automatically included and applied to components
- **API Integration**: Simple utilities for fetching data from your backend

## Usage

### Blog List Page

Create a page to display all blog articles:

```tsx
// app/blog/page.tsx (App Router)
"use client";

import { useState, useEffect } from 'react';
import { BlogArticlesTemplate, fetchBlogs, Blog } from 'famous-ai';

export default function BlogPage() {
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

### Single Blog Article Page

Create a page to display a single blog article:

```tsx
// app/blog/[slug]/page.tsx (App Router)
"use client";

import { useState, useEffect } from 'react';
import { BlogArticleTemplate, fetchBlogBySlug, Blog } from 'famous-ai';

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
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

### Styling

The package **automatically includes all necessary CSS styles**. They are bundled with the components and will be applied automatically when you use them in your application.

All styles use the `famousai-` prefix for class names to prevent conflicts with your application styles.

## API

### Components

- `BlogArticlesTemplate`: A React component that renders a list of blog articles
- `BlogArticleTemplate`: A React component that renders a single blog article

### Utilities

- `fetchBlogs`: Fetches all blog articles from your API
- `fetchBlogBySlug`: Fetches a specific blog article by its slug
- `fetchBlogById`: Fetches a specific blog article by its ID

### Types

- `Blog`: Interface for blog article data
- `BlogResponse`: Interface for API response containing blogs
- `FetchBlogsConfig`: Configuration options for API requests
- `BlogArticlesTemplateProps`: Props for the BlogArticlesTemplate component
- `BlogArticleTemplateProps`: Props for the BlogArticleTemplate component

## License

MIT