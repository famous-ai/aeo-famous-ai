import React from 'react';
import Head from 'next/head';
import { Blog } from '../types/blog-types';
import { BlogRenderer } from '../components/BlogRenderer';

export interface BlogTemplateProps {
  /**
   * Blog data to be rendered
   */
  blog: Blog;
  
  /**
   * Custom CSS class for the blog container
   */
  className?: string;
  
  /**
   * Custom components to be rendered at the top of the blog
   */
  headerContent?: React.ReactNode;
  
  /**
   * Custom components to be rendered at the bottom of the blog
   */
  footerContent?: React.ReactNode;
  
  /**
   * Whether to include SEO metadata
   */
  includeSeo?: boolean;
  
  /**
   * Whether to include JSON-LD structured data
   */
  includeJsonLd?: boolean;
}

/**
 * A template component for rendering a complete blog page with SEO features
 */
export const BlogTemplate: React.FC<BlogTemplateProps> = ({
  blog,
  className = 'famousai-blog-template',
  headerContent,
  footerContent,
  includeSeo = true,
  includeJsonLd = true,
}) => {
  // Get metadata from the blog object
  const { metadata } = blog.technical_data;
  
  return (
    <div className={className}>
      {/* SEO metadata */}
      {includeSeo && (
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
          
          {/* Alternate language links */}
          {metadata.hreflang.map((item, i) => (
            <link 
              key={i} 
              rel="alternate" 
              hrefLang={item.lang} 
              href={item.url} 
            />
          ))}
        </Head>
      )}
      
      {/* Custom header content */}
      {headerContent}
      
      {/* Blog content */}
      <BlogRenderer 
        blog={blog} 
        includeJsonLd={includeJsonLd}
      />
      
      {/* Custom footer content */}
      {footerContent}
    </div>
  );
};