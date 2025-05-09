# Blog Usage Guide

This guide explains how to integrate Famous AI's blog functionality into your Next.js application for SEO and AEO optimization.

## Setting Up Blog Pages

### 1. Install the Package

```bash
npm install aeo-famous-ai
```

### 2. Configure Environment Variables

In your `.env` or `.env.local` file:

```
API_BASE_URL=http://0.0.0.0:8000
API_KEY=wsk_ff016b385a4755fd1da83795553827b1
```

### 3. Create Blog Pages

#### Blog Index Page (`pages/blog/index.tsx`)

```tsx
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
                {blog.content
                  .replace(/<[^>]*>/g, '')
                  .substring(0, 150)}...
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

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const apiBaseUrl = process.env.API_BASE_URL || '';
  const apiKey = process.env.API_KEY || '';
  
  const blogClient = new BlogClient(apiBaseUrl, apiKey);
  
  try {
    const blogs = await blogClient.fetchPublishedBlogs();
    
    return {
      props: {
        blogs
      },
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
```

#### Blog Detail Page (`pages/blog/[slug].tsx`)

```tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { 
  Blog, 
  BlogTemplate,
  generateBlogPaths, 
  generateBlogProps 
} from 'aeo-famous-ai';

interface BlogPageProps {
  blog: Blog | null;
}

export default function BlogPage({ blog }: BlogPageProps) {
  if (!blog) {
    return <div className="famousai-blog-not-found">Blog not found</div>;
  }

  return (
    <BlogTemplate 
      blog={blog}
      headerContent={
        <div className="famousai-blog-header">
          <div className="famousai-breadcrumbs">
            <a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; <span>{blog.title}</span>
          </div>
        </div>
      }
      footerContent={
        <div className="famousai-blog-footer">
          <div className="famousai-author-bio">
            <h3>About the Author</h3>
            <p>Written by the Famous AI team</p>
          </div>
        </div>
      }
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const config = {
    apiBaseUrl: process.env.API_BASE_URL || '',
    apiKey: process.env.API_KEY || '',
    revalidateTime: 3600
  };

  return await generateBlogPaths(config);
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  
  const config = {
    apiBaseUrl: process.env.API_BASE_URL || '',
    apiKey: process.env.API_KEY || '',
    revalidateTime: 3600
  };

  return await generateBlogProps(config, slug);
};
```

### 4. Add CSS Styles

Create a CSS file for your blog styles:

```css
/* styles/blog.css */
.famousai-blog-article {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.famousai-blog-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.famousai-blog-content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #444;
}

/* Add more styling as needed */
```

## Using the Blog Components Directly

If you need more customization, you can use the individual components:

### Custom Blog Renderer

```tsx
import { Blog, BlogRenderer } from 'aeo-famous-ai';

interface Props {
  blog: Blog;
}

export default function CustomBlogPage({ blog }: Props) {
  return (
    <div className="custom-container">
      <BlogRenderer
        blog={blog}
        className="custom-blog"
        titleClassName="custom-title"
        contentClassName="custom-content"
        titleRenderer={(blog) => (
          <h1 className="fancy-title">{blog.title}</h1>
        )}
        dateRenderer={(blog) => (
          <div className="fancy-date">
            {new Date(blog.published_at || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      />
    </div>
  );
}
```

## API Reference

### BlogClient

```tsx
const blogClient = new BlogClient(
  'http://0.0.0.0:8000',  // API base URL
  'wsk_ff016b385a4755fd1da83795553827b1'  // API key
);

// Fetch all published blogs
const blogs = await blogClient.fetchPublishedBlogs();

// Fetch a blog by ID
const blog = await blogClient.fetchBlogById(123);

// Fetch a blog by slug
const blog = await blogClient.fetchBlogBySlug('my-blog-post');
```

### Page Generation Utilities

```tsx
// Generate static paths
const paths = await generateBlogPaths({
  apiBaseUrl: 'http://0.0.0.0:8000',
  apiKey: 'wsk_ff016b385a4755fd1da83795553827b1',
  // Optional custom path generator
  pathGenerator: (blog) => `/custom-blog/${blog.technical_data.url_data.slug}`,
  revalidateTime: 3600
});

// Generate props for a specific page
const props = await generateBlogProps({
  apiBaseUrl: 'http://0.0.0.0:8000',
  apiKey: 'wsk_ff016b385a4755fd1da83795553827b1',
  revalidateTime: 3600
}, 'my-blog-slug');
```

## Advanced Usage

### Custom Path Generation

You can customize how blog URLs are generated:

```tsx
const config = {
  apiBaseUrl: process.env.API_BASE_URL || '',
  apiKey: process.env.API_KEY || '',
  pathGenerator: (blog) => {
    // Generate paths like /blog/category/slug
    const category = blog.technical_data.entity_data.primary_entities[0]?.name || 'general';
    return `/blog/${category}/${blog.technical_data.url_data.slug}`;
  }
};
```

### Custom Metadata Generation

You can customize metadata for each blog:

```tsx
import { generateBlogMetadata, Blog } from 'aeo-famous-ai';

function getCustomMetadata(blog: Blog) {
  const baseMetadata = generateBlogMetadata(blog);
  
  // Add or modify metadata
  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      siteName: 'My Custom Blog',
    },
    // Add custom metadata fields
    custom: {
      readingTime: `${Math.ceil(blog.content.length / 1000)} min read`
    }
  };
}
```