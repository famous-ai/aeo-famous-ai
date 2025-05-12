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
      basePath="/famous-ai/blog"
      homePath="/"
    />
  );
}