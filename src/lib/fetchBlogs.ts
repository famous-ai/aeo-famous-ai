import { BlogResponse, Blog } from '../types/blog-types';

export interface FetchBlogsConfig {
  /**
   * API Key for authentication (optional if set via environment variable)
   */
  apiKey?: string;

  /**
   * Base URL for the API (optional if set via environment variable)
   */
  apiBaseUrl?: string;

  /**
   * Endpoint path for blogs API
   */
  endpoint?: string;

  /**
   * Headers to include in the request
   */
  headers?: Record<string, string>;
}

/**
 * Configuration options for the fetchBlogs function
 */
export interface FetchBlogsOptions {
  /**
   * Whether to only fetch published blogs
   */
  publishedOnly?: boolean;

  /**
   * Filter blogs by slug
   */
  slug?: string;

  /**
   * Filter blogs by ID
   */
  id?: number;
}

/**
 * Default fetch blogs config
 */
const defaultConfig: FetchBlogsConfig = {
  apiKey: process.env.FAMOUS_AI_API_KEY,
  apiBaseUrl: process.env.FAMOUS_AI_API_BASE_URL,
  endpoint: 'api/v1/blogs',
  headers: {}
};

/**
 * Fetch blogs from the API
 * @param config - Configuration for the fetch request
 * @param options - Options for filtering blogs
 * @returns Promise with BlogResponse or null
 */
export async function fetchBlogs(
  config: FetchBlogsConfig = {},
  options: FetchBlogsOptions = {}
): Promise<BlogResponse | null> {
  // Merge provided config with defaults and environment variables
  const finalConfig = { ...defaultConfig, ...config };
  const { apiKey, apiBaseUrl, endpoint, headers } = finalConfig;
  const { publishedOnly = true, slug, id } = options;

  // Validate required config
  if (!apiKey) {
    console.error('API Key is required. Set it in config or through the FAMOUS_AI_API_KEY environment variable.');
    return null;
  }

  if (!apiBaseUrl) {
    console.error('API Base URL is required. Set it in config or through the FAMOUS_AI_API_BASE_URL environment variable.');
    return null;
  }

  // Build the URL
  let url = apiBaseUrl.endsWith('/')
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl;

  url += `/${endpoint}`;

  // Add published filter if needed
  if (publishedOnly) {
    url += '/published';
  }

  // Add ID filter if provided
  if (id) {
    url += `/${id}`;
  }

  // Add timestamp to ensure fresh data during each build
  const timestamp = Date.now();
  
  // Prepare headers with cache control to prevent caching without Next.js warnings
  const requestHeaders: Record<string, string> = {
    'accept': 'application/json',
    'X-API-Key': apiKey,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'x-build-time': timestamp.toString(),
    ...headers
  };

  try {
    // Standard fetch with cache-busting headers added to request
    const response = await fetch(url, {
      method: 'GET',
      headers: requestHeaders
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No blogs found at ${url}`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse response based on whether we're fetching a single blog or multiple blogs
    if (id) {
      const blog: Blog = await response.json();
      return {
        workspace_id: 0, // This is a placeholder since single blog endpoint doesn't return workspace_id
        blogs: [blog],
        count: 1
      };
    } else {
      const data: BlogResponse = await response.json();

      // If slug is provided, filter the blogs
      if (slug && data.blogs) {
        const filteredBlogs = data.blogs.filter(blog =>
          blog.technical_data.url_data.slug === slug
        );

        return {
          ...data,
          blogs: filteredBlogs,
          count: filteredBlogs.length
        };
      }

      return data;
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return null;
  }
}

/**
 * Fetch a single blog by slug
 * @param slug - Blog slug to fetch
 * @param config - Configuration for the fetch request
 * @returns Promise with Blog or null
 */
export async function fetchBlogBySlug(
  slug: string,
  config: FetchBlogsConfig = {}
): Promise<Blog | null> {
  const response = await fetchBlogs(config, { slug });

  if (response && response.blogs && response.blogs.length > 0) {
    return response.blogs[0];
  }

  return null;
}

/**
 * Fetch a single blog by ID
 * @param id - Blog ID to fetch
 * @param config - Configuration for the fetch request
 * @returns Promise with Blog or null
 */
export async function fetchBlogById(
  id: number,
  config: FetchBlogsConfig = {}
): Promise<Blog | null> {
  const response = await fetchBlogs(config, { id });

  if (response && response.blogs && response.blogs.length > 0) {
    return response.blogs[0];
  }

  return null;
}