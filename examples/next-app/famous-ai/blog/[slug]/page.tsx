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
    keywords: blog.technical_data.metadata.core.keywords,
    authors: blog.technical_data.metadata.core.authors.map((author) => ({
      name: author.name,
      url: author.url,
    })),
    creator: blog.technical_data.metadata.core.creator,
    publisher: blog.technical_data.metadata.core.publisher,
    robots: {
      index: blog.technical_data.metadata.core.robots.index,
      follow: blog.technical_data.metadata.core.robots.follow,
    },
    openGraph: {
      title: blog.technical_data.metadata.open_graph.title,
      description: blog.technical_data.metadata.open_graph.description,
      url: blog.technical_data.metadata.open_graph.url,
      images: blog.technical_data.metadata.open_graph.images.map((image) => ({
        url: image.url,
        alt: image.alt,
      })),
      siteName: blog.technical_data.metadata.open_graph.site_name,
      type: 'article',
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
      basePath="/famous-ai/blog"
      homePath="/"
    />
  );
}