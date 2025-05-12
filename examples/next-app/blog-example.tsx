import React, { useState, useEffect } from 'react';
import {
  BlogArticlesTemplate,
  BlogArticleTemplate,
  fetchBlogs,
  fetchBlogBySlug,
  Blog,
  BlogResponse
} from 'aeo-famous-ai';

// Example of a Blog List Page
export function BlogListExample() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        // Fetch blogs using the library function
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

    loadBlogs();
  }, []);

  return (
    <div>
      <h1>Blog List Example</h1>
      <p>This example shows how to use the BlogArticlesTemplate component:</p>
      
      {/* Use the BlogArticlesTemplate component */}
      <BlogArticlesTemplate
        blogs={blogs}
        loading={loading}
        basePath="/blog"
        title="Our Blog Articles"
      />
    </div>
  );
}

// Example of a Single Blog Page
export function SingleBlogExample({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        // Fetch a specific blog by slug
        const fetchedBlog = await fetchBlogBySlug(slug);
        setBlog(fetchedBlog);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, [slug]);

  return (
    <div>
      <h1>Single Blog Example</h1>
      <p>This example shows how to use the BlogArticleTemplate component:</p>
      
      {/* Use the BlogArticleTemplate component */}
      <BlogArticleTemplate
        blog={blog}
        loading={loading}
        basePath="/blog"
        homePath="/"
      />
    </div>
  );
}

// Example of environment configuration
// In your .env file or environment variables:
/*
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
NEXT_PUBLIC_API_KEY=your-api-key
*/

// Example of Next.js API Routes integration
// pages/api/blogs.ts
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchBlogs, BlogResponse } from 'aeo-famous-ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | { error: string }>
) {
  try {
    const response = await fetchBlogs();
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'No blogs found' });
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}
*/

// Example of Next.js Pages Router integration
// pages/blog/[slug].tsx
/*
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
*/

// Example of Next.js App Router integration
// app/blog/[slug]/page.tsx
/*
import { BlogArticleTemplate, fetchBlogBySlug } from 'aeo-famous-ai';

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await fetchBlogBySlug(params.slug);
  
  return (
    <BlogArticleTemplate
      blog={blog}
      basePath="/blog"
      homePath="/"
    />
  );
}
*/