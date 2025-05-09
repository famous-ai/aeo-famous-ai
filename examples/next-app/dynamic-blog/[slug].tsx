import { GetStaticPaths, GetStaticProps } from 'next';
import { 
  Blog, 
  BlogTemplate,
  generateBlogPaths, 
  generateBlogProps 
} from 'aeo-famous-ai'; // Import from your package
import styles from '../styles/BlogPage.module.css';

interface BlogPageProps {
  blog: Blog | null;
}

export default function DynamicBlogPage({ blog }: BlogPageProps) {
  if (!blog) {
    return <div className={styles['famousai-blog-not-found']}>Blog not found</div>;
  }

  return (
    <>
      {/* Related blog posts could be shown above the blog */}
      <div className={styles['famousai-related-posts']}>
        {/* You could fetch and display related posts here */}
      </div>

      {/* Using the BlogTemplate component for the main content */}
      <BlogTemplate 
        blog={blog}
        className={styles['famousai-blog-template']}
        headerContent={
          <div className={styles['famousai-blog-header']}>
            {/* Custom header content like breadcrumbs */}
            <div className={styles['famousai-breadcrumbs']}>
              <a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; <span>{blog.title}</span>
            </div>
          </div>
        }
        footerContent={
          <div className={styles['famousai-blog-footer']}>
            {/* Custom footer content like author bio, share buttons, etc. */}
            <div className={styles['famousai-author-bio']}>
              <h3>About the Author</h3>
              <p>Written by the Famous AI team</p>
            </div>

            <div className={styles['famousai-social-share']}>
              <h3>Share this post</h3>
              <div className={styles['famousai-share-buttons']}>
                <button>Twitter</button>
                <button>Facebook</button>
                <button>LinkedIn</button>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}

// Generate all possible blog paths at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Configure with your API details
  const config = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://0.0.0.0:8000',
    apiKey: process.env.API_KEY || 'wsk_ff016b385a4755fd1da83795553827b1',
    // Optional custom path generator
    // pathGenerator: (blog) => `/custom-blog/${blog.technical_data.url_data.slug}`,
    // Optional revalidation time
    revalidateTime: 3600 // 1 hour
  };

  return await generateBlogPaths(config);
};

// Generate static props for a specific blog page
export const getStaticProps: GetStaticProps<BlogPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  
  // Configure with your API details
  const config = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://0.0.0.0:8000',
    apiKey: process.env.API_KEY || 'wsk_ff016b385a4755fd1da83795553827b1',
    // Optional revalidation time
    revalidateTime: 3600 // 1 hour
  };

  return await generateBlogProps(config, slug);
};