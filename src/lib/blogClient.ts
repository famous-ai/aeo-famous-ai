import { BlogResponse, Blog } from '../types/blog-types';

/**
 * BlogClient for interacting with the blog API
 */
export class BlogClient {
  private baseUrl: string;
  private apiKey: string;

  /**
   * Create a new BlogClient instance
   * @param baseUrl - Base URL for the API (e.g. 'http://0.0.0.0:8000')
   * @param apiKey - API key for authentication
   */
  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.endsWith('/') 
      ? baseUrl.slice(0, -1) 
      : baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Fetch all published blogs
   * @returns Promise with array of Blog objects
   */
  async fetchPublishedBlogs(): Promise<Blog[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/blogs/published`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-Key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogResponse = await response.json();
      console.log(`Successfully fetched ${data.blogs.length} published blogs from ${this.baseUrl}`);
      return data.blogs;
    } catch (error) {
      console.error('Error fetching published blogs:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific blog by ID
   * @param id - Blog ID to fetch
   * @returns Promise with Blog object or null if not found
   */
  async fetchBlogById(id: number): Promise<Blog | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/blogs/${id}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-Key': this.apiKey
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blog: Blog = await response.json();
      console.log(`Successfully fetched blog with ID ${id}`);
      return blog;
    } catch (error) {
      console.error(`Error fetching blog with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetch blogs by slug
   * @param slug - Blog slug to search for
   * @returns Promise with array of Blog objects
   */
  async fetchBlogBySlug(slug: string): Promise<Blog | null> {
    try {
      const blogs = await this.fetchPublishedBlogs();
      const matchingBlog = blogs.find(blog => 
        blog.technical_data.url_data.slug === slug
      );
      
      if (matchingBlog) {
        console.log(`Successfully found blog with slug: ${slug}`);
      } else {
        console.log(`No blog found with slug: ${slug}`);
      }
      return matchingBlog || null;
    } catch (error) {
      console.error(`Error fetching blog with slug ${slug}:`, error);
      throw error;
    }
  }
}