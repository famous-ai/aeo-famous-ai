// This file serves as a reference for implementing the Famous AI blog components
// in a Next.js application using the new App Router

// For the blog listing page (app/blog/page.tsx):
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

// For the individual blog page (app/blog/[slug]/page.tsx):
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

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
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