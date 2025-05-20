import { notFound } from "next/navigation";
import { BlogArticleTemplate, fetchBlogs, fetchBlogBySlug } from "famous-ai";

interface PageProps {
  params: Promise<{ slug: string }> & { slug: string };
}

// Generate static paths at build time
export async function generateStaticParams() {
  const response = await fetchBlogs();
  const blogs = response?.blogs || [];

  return blogs.map((blog) => ({
    slug: blog.technical_data.url_data.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const blog = await fetchBlogBySlug(resolvedParams.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
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

// Default page component
export default async function BlogPage({ params }: PageProps) {
  const resolvedParams = await params;
  const blog = await fetchBlogBySlug(resolvedParams.slug);

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
