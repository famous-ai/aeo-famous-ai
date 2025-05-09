import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { BlogClient, Blog } from 'aeo-famous-ai';
import styles from '../styles/BlogPage.module.css';

interface BlogIndexProps {
  blogs: Blog[];
}

export default function BlogIndex({ blogs }: BlogIndexProps) {
  return (
    <>
      <Head>
        <title>Blog Articles</title>
        <meta name="description" content="Browse our collection of blog articles" />
        <link rel="canonical" href="/blog" />
      </Head>

      <div className={styles['famousai-blog-index']}>
        <h1 className={styles['famousai-blog-index-title']}>Blog Articles</h1>
        
        <div className={styles['famousai-blog-list']}>
          {blogs.length === 0 && (
            <p className={styles['famousai-blog-empty']}>No blog articles found.</p>
          )}
          
          {blogs.map((blog) => (
            <article key={blog.id} className={styles['famousai-blog-item']}>
              <h2 className={styles['famousai-blog-item-title']}>
                <Link 
                  href={`/blog/${blog.technical_data.url_data.slug}`}
                >
                  {blog.title}
                </Link>
              </h2>
              
              {blog.published_at && (
                <div className={styles['famousai-blog-date']}>
                  Published: {new Date(blog.published_at).toLocaleDateString()}
                </div>
              )}
              
              <div className={styles['famousai-blog-excerpt']}>
                {/* Strip HTML and limit excerpt length */}
                {blog.content
                  .replace(/<[^>]*>/g, '')
                  .substring(0, 150)}...
              </div>
              
              <Link 
                href={`/blog/${blog.technical_data.url_data.slug}`}
                className={styles['famousai-blog-read-more']}
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

// Generate static props for the blog index page at build time
export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  // Configure with your API details
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