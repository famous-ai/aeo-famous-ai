import { BlogArticlesTemplate, fetchBlogs } from 'famous-ai';

// export const revalidate = 3600; // Revalidate every hour (optional)

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
