import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { 
  Blog, 
  BlogClient, 
  generateStaticBlogPaths, 
  generateStaticBlogProps,
  generateBlogJsonLd
} from 'aeo-famous-ai'; // Import from your package

interface BlogPageProps {
  blog: Blog | null;
}

// Blog detail page component
export default function BlogPage({ blog }: BlogPageProps) {
  if (!blog) {
    return <div className="famousai-blog-not-found">Blog not found</div>;
  }

  const { title, content } = blog;
  const { metadata } = blog.technical_data;
  const jsonLd = generateBlogJsonLd(blog);

  return (
    <>
      <Head>
        <title>{metadata.core.title}</title>
        <meta name="description" content={metadata.core.description} />
        <link rel="canonical" href={metadata.core.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.open_graph.title} />
        <meta property="og:description" content={metadata.open_graph.description} />
        <meta property="og:type" content={metadata.open_graph.type} />
        <meta property="og:url" content={metadata.open_graph.url} />
        <meta property="og:site_name" content={metadata.open_graph.site_name} />
        {metadata.open_graph.images.map((img, i) => (
          <meta key={i} property="og:image" content={img.url} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content={metadata.twitter.card_type} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </Head>

      <article className="famousai-blog-article">
        <h1 className="famousai-blog-title">{title}</h1>
        
        {/* Using dangerouslySetInnerHTML to render the HTML content */}
        <div 
          className="famousai-blog-content"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </article>
    </>
  );
}

// Generate all possible blog paths at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Configure the blog client with your API details
  const config = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://0.0.0.0:8000',
    apiKey: process.env.API_KEY || 'wsk_ff016b385a4755fd1da83795553827b1',
  };

  // Generate paths for all blogs
  return await generateStaticBlogPaths(config);
};

// Generate static props for a specific blog page
export const getStaticProps: GetStaticProps<BlogPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  
  // Configure the blog client with your API details
  const config = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://0.0.0.0:8000',
    apiKey: process.env.API_KEY || 'wsk_ff016b385a4755fd1da83795553827b1',
  };

  // Get the blog data for this slug
  return await generateStaticBlogProps(config, slug);
};