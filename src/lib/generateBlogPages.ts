import { Blog, BlogResponse } from '../types/blog-types';
import { BlogClient } from './blogClient';

export interface GenerateBlogPagesConfig {
  /**
   * Base URL for the API
   */
  apiBaseUrl: string;
  
  /**
   * API key for authentication
   */
  apiKey: string;
  
  /**
   * Optional custom path generator function
   */
  pathGenerator?: (blog: Blog) => string;
  
  /**
   * How often to revalidate pages (in seconds)
   */
  revalidateTime?: number;
}

/**
 * Default path generator that uses the blog's slug
 */
export const defaultBlogPathGenerator = (blog: Blog): string => {
  return `/blog/${blog.technical_data.url_data.slug}`;
};

/**
 * Generate static paths for all blog pages
 */
export async function generateBlogPaths(
  config: GenerateBlogPagesConfig
): Promise<{ paths: { params: { slug: string } }[]; fallback: boolean | 'blocking' }> {
  const { 
    apiBaseUrl, 
    apiKey, 
    pathGenerator = defaultBlogPathGenerator 
  } = config;
  
  const blogClient = new BlogClient(apiBaseUrl, apiKey);

  try {
    const blogs = await blogClient.fetchPublishedBlogs();
    
    const paths = blogs.map((blog) => {
      const path = pathGenerator(blog);
      const slug = path.split('/').pop() || '';
      
      return {
        params: { slug }
      };
    });

    console.log(`Generated ${paths.length} blog paths for dynamic pages`);
    return {
      paths,
      fallback: 'blocking' // Show 404 for non-existent pages after checking the server
    };
  } catch (error) {
    console.error('Error generating blog paths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

/**
 * Generate static props for a blog page
 */
export async function generateBlogProps(
  config: GenerateBlogPagesConfig,
  slug: string
): Promise<{ props: { blog: Blog | null }; revalidate?: number }> {
  const { 
    apiBaseUrl, 
    apiKey,
    revalidateTime = 3600 // Default to 1 hour
  } = config;
  
  const blogClient = new BlogClient(apiBaseUrl, apiKey);

  try {
    const blog = await blogClient.fetchBlogBySlug(slug);
    
    if (blog) {
      console.log(`Generated props for dynamic blog page: ${blog.title}`);
    } else {
      console.log(`No blog found with slug: ${slug} for dynamic props generation`);
    }
    return {
      props: {
        blog: blog || null
      },
      revalidate: revalidateTime
    };
  } catch (error) {
    console.error(`Error generating props for blog slug ${slug}:`, error);
    return {
      props: {
        blog: null
      },
      revalidate: revalidateTime
    };
  }
}