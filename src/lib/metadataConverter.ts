import type { Metadata } from 'next';
import type { Blog, SimpleFAQItem } from '../types/blog-types';

/**
 * Converts blog technical data to Next.js Metadata format
 * @param blog The blog object containing technical data
 * @returns Next.js compatible Metadata object
 */
export function convertBlogToNextMetadata(blog: Blog): Metadata {
  const { technical_data } = blog;
  const { metadata, entity_data } = technical_data;

  // Extract FAQs for structured data
  const faqs: SimpleFAQItem[] =
    blog.faqs ||
    technical_data?.schemas?.faq?.mainEntity?.map((item) => ({
      question: item.name,
      answer: item.acceptedAnswer.text,
    })) ||
    [];

  // Create Next.js metadata object
  const nextMetadata: Metadata = {
    // Core metadata
    title: metadata.core.title,
    description: metadata.core.description,

    // Canonical URL
    alternates: {
      canonical: metadata.core.canonical,
      languages: {},
    },

    // OpenGraph metadata
    openGraph: {
      title: metadata.open_graph.title,
      description: metadata.open_graph.description,
      type: (metadata.open_graph.type === 'article' ? 'article' : 'website') as
        | 'article'
        | 'website',
      url: metadata.open_graph.url,
      siteName: metadata.open_graph.site_name,
      images: metadata.open_graph.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
      // Only include article info if type is 'article'
      ...(metadata.open_graph.type === 'article' && {
        article: {
          publishedTime: metadata.open_graph.article.published_time,
          modifiedTime: metadata.open_graph.article.modified_time,
          section: metadata.open_graph.article.section,
          authors: metadata.open_graph.article.authors,
          tags: metadata.open_graph.article.tags,
        },
      }),
    },

    // Twitter metadata
    twitter: {
      card: metadata.twitter.card_type as 'summary' | 'summary_large_image' | 'app' | 'player',
      site: metadata.twitter.site,
      creator: metadata.twitter.creator,
      title: metadata.twitter.title,
      description: metadata.twitter.description,
    },

    // Keywords
    keywords: entity_data.primary_entities.map((entity) => entity.name),

    // Authors (if available)
    ...(metadata.open_graph.article.authors?.length && {
      authors: metadata.open_graph.article.authors.map((author) => ({
        name: author,
      })),
    }),

    // FAQ structured data for enhanced SEO
    ...(faqs.length > 0 && {
      other: {
        'script:ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }),
      },
    }),
  };

  // Add hreflang alternates if available
  if (metadata.hreflang && metadata.hreflang.length > 0) {
    const languages: Record<string, string> = {};

    metadata.hreflang.forEach((item) => {
      languages[item.lang] = item.url;
    });

    if (Object.keys(languages).length > 0) {
      nextMetadata.alternates = {
        ...nextMetadata.alternates,
        languages,
      };
    }
  }

  return nextMetadata;
}
