import { Blog } from '../types/blog-types';
import { BlogClient } from './blogClient';

/**
 * Configuration for generating static blog pages
 */
export interface StaticBlogConfig {
  /** Base URL for the API (e.g. 'http://0.0.0.0:8000') */
  apiBaseUrl: string;
  
  /** API key for authentication */
  apiKey: string;
  
  /** Optional custom function to generate the URL path for a blog */
  pathGenerator?: (blog: Blog) => string;
}

/**
 * Default path generator that uses the blog's slug
 * @param blog - Blog object
 * @returns Generated path string
 */
export const defaultPathGenerator = (blog: Blog): string => {
  return `/blog/${blog.technical_data.url_data.slug}`;
};

/**
 * Generate static paths for getStaticPaths in Next.js
 * @param config - Configuration for generating static paths
 * @returns Object with paths array for Next.js getStaticPaths
 */
export async function generateStaticBlogPaths(
  config: StaticBlogConfig
): Promise<{ paths: { params: { slug: string } }[]; fallback: boolean }> {
  const { apiBaseUrl, apiKey, pathGenerator = defaultPathGenerator } = config;
  const blogClient = new BlogClient(apiBaseUrl, apiKey);

  try {
    const blogs = await blogClient.fetchPublishedBlogs();
    
    // Generate paths for each blog
    const paths = blogs.map((blog) => {
      // Extract slug from the path
      const path = pathGenerator(blog);
      const slug = path.split('/').pop() || blog.technical_data.url_data.slug;
      
      return {
        params: { slug }
      };
    });

    console.log(`Generated ${paths.length} static blog paths`);
    return {
      paths,
      fallback: 'blocking' as any // Allow fallback for new blogs
    };
  } catch (error) {
    console.error('Error generating static blog paths:', error);
    return {
      paths: [],
      fallback: 'blocking' as any
    };
  }
}

/**
 * Generate static props for a specific blog page
 * @param config - Configuration for generating static props
 * @param slug - The blog slug to fetch
 * @returns Props object for Next.js getStaticProps
 */
export async function generateStaticBlogProps(
  config: StaticBlogConfig,
  slug: string
): Promise<{ props: { blog: Blog | null }; revalidate?: number }> {
  const { apiBaseUrl, apiKey } = config;
  const blogClient = new BlogClient(apiBaseUrl, apiKey);

  try {
    const blog = await blogClient.fetchBlogBySlug(slug);
    
    if (blog) {
      console.log(`Generated static props for blog: ${blog.title}`);
    } else {
      console.log(`No blog found with slug: ${slug} for static props generation`);
    }
    return {
      props: {
        blog: blog || null
      },
      revalidate: 3600 // Revalidate every hour (or set your preferred time)
    };
  } catch (error) {
    console.error(`Error generating static props for blog slug ${slug}:`, error);
    return {
      props: {
        blog: null
      },
      revalidate: 3600
    };
  }
}

/**
 * Generate metadata for a blog post (for Next.js app router)
 * @param blog - Blog object
 * @returns Metadata object compatible with Next.js metadata API
 */
export function generateBlogMetadata(blog: Blog): Record<string, any> {
  if (!blog) return {};
  console.log(`Generating metadata for blog: ${blog.title}`);
  
  const { metadata } = blog.technical_data;
  
  return {
    title: metadata.core.title,
    description: metadata.core.description,
    canonical: metadata.core.canonical,
    openGraph: {
      title: metadata.open_graph.title,
      description: metadata.open_graph.description,
      type: metadata.open_graph.type,
      url: metadata.open_graph.url,
      siteName: metadata.open_graph.site_name,
      images: metadata.open_graph.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt
      })),
      locale: 'en_US',
      authors: metadata.open_graph.article.authors,
      publishedTime: metadata.open_graph.article.published_time,
      modifiedTime: metadata.open_graph.article.modified_time
    },
    twitter: {
      card: metadata.twitter.card_type,
      site: metadata.twitter.site,
      creator: metadata.twitter.creator,
      title: metadata.twitter.title,
      description: metadata.twitter.description
    },
    alternates: {
      canonical: metadata.core.canonical,
      languages: metadata.hreflang.reduce((acc, item) => {
        acc[item.lang] = item.url;
        return acc;
      }, {} as Record<string, string>)
    }
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 * @param blog - Blog object
 * @returns JSON-LD script content as string
 */
export function generateBlogJsonLd(blog: Blog): string {
  if (!blog) return '';
  
  const { schemas } = blog.technical_data;
  
  const articleSchema = {
    '@context': schemas.article['@context'],
    '@type': schemas.article['@type'],
    headline: schemas.article.headline,
    name: schemas.article.name,
    description: schemas.article.description,
    author: schemas.article.author,
    publisher: schemas.article.publisher,
    datePublished: schemas.article.datePublished,
    dateModified: schemas.article.dateModified,
    mainEntityOfPage: schemas.article.mainEntityOfPage,
    isAccessibleForFree: schemas.article.isAccessibleForFree,
    about: schemas.article.about,
    mentions: schemas.article.mentions,
    keywords: schemas.article.keywords
  };
  
  const faqSchema = {
    '@context': schemas.faq['@context'],
    '@type': schemas.faq['@type'],
    mainEntity: schemas.faq.mainEntity
  };
  
  const breadcrumbSchema = {
    '@context': schemas.breadcrumb['@context'],
    '@type': schemas.breadcrumb['@type'],
    itemListElement: schemas.breadcrumb.itemListElement
  };
  
  // Return all schemas as a string array
  return JSON.stringify([articleSchema, faqSchema, breadcrumbSchema]);
}