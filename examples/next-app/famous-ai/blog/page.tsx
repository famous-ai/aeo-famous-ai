"use client";

import { useState, useEffect } from 'react';
import { BlogArticlesTemplate, fetchBlogs, BlogResponse, Blog } from 'aeo-famous-ai';

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
      basePath="/famous-ai/blog"
    />
  );
}