import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Blog, BlogClient } from 'aeo-famous-ai'; // Import from your package

interface BlogIndexProps {
  blogs: Blog[];
}

// Blog index page component
export default function BlogIndex({ blogs }: BlogIndexProps) {
  return (
    <>
      <Head>
        <title>Blog Articles</title>
        <meta name="description" content="Browse our collection of blog articles" />
        <link rel="canonical" href="/blog" />
      </Head>

      <div className="famousai-blog-index">
        <h1 className="famousai-blog-index-title">Blog Articles</h1>
        
        <div className="famousai-blog-list">
          {blogs.length === 0 && (
            <p className="famousai-blog-empty">No blog articles found.</p>
          )}
          
          {blogs.map((blog) => (
            <article key={blog.id} className="famousai-blog-item">
              <h2 className="famousai-blog-item-title">
                <Link 
                  href={`/blog/${blog.technical_data.url_data.slug}`}
                  className="famousai-blog-item-link"
                >
                  {blog.title}
                </Link>
              </h2>
              {blog.published_at && (
                <div className="famousai-blog-date">
                  Published: {new Date(blog.published_at).toLocaleDateString()}
                </div>
              )}
              <div className="famousai-blog-excerpt">
                {blog.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
              </div>
              <Link 
                href={`/blog/${blog.technical_data.url_data.slug}`}
                className="famousai-blog-read-more"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

// Generate static props for the blog index page
export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  // Configure the blog client with your API details
  const apiBaseUrl = process.env.API_BASE_URL || 'http://0.0.0.0:8000';
  const apiKey = process.env.API_KEY || 'wsk_ff016b385a4755fd1da83795553827b1';
  
  const blogClient = new BlogClient(apiBaseUrl, apiKey);
  
  try {
    // Fetch all published blogs
    const blogs = await blogClient.fetchPublishedBlogs();
    
    return {
      props: {
        blogs
      },
      // Revalidate the data every hour (3600 seconds)
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        blogs: []
      },
      revalidate: 3600
    };
  }
};