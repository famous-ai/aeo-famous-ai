// blog-types.ts

// Core Types
export interface BlogResponse {
  workspace_id: number;
  blogs: Blog[];
  count: number;
}

export interface Blog {
  id: number;
  idea_id: number;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  published_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  technical_data: TechnicalData;
}

// Technical Data Types
export interface TechnicalData {
  metadata: MetadataStructure;
  schemas: SchemaStructure;
  url_data: UrlData;
  entity_data: EntityData;
  content_structure: ContentStructure;
}

// Metadata Types
export interface MetadataStructure {
  core: CoreMetadata;
  open_graph: OpenGraphMetadata;
  twitter: TwitterMetadata;
  hreflang: HrefLangItem[];
}

export interface CoreMetadata {
  title: string;
  description: string;
  canonical: string;
}

export interface OpenGraphMetadata {
  title: string;
  description: string;
  type: string;
  url: string;
  site_name: string;
  images: OGImage[];
  article: OGArticle;
}

export interface OGImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface OGArticle {
  published_time: string;
  modified_time: string;
  section: string;
  authors: string[];
  tags: string[];
}

export interface TwitterMetadata {
  card_type: string;
  site: string;
  creator: string;
  title: string;
  description: string;
}

export interface HrefLangItem {
  lang: string;
  url: string;
}

// Schema Types
export interface SchemaStructure {
  article: ArticleSchema;
  faq: FAQSchema;
  breadcrumb: BreadcrumbSchema;
  image: ImageSchema;
  speakable: SpeakableSchema;
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  name: string;
  description: string;
  author: SchemaAuthor;
  publisher: SchemaPublisher;
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: MainEntityOfPage;
  isAccessibleForFree: boolean;
  license: string;
  about: SchemaThing[];
  mentions: SchemaThing[];
  keywords: string[];
}

export interface SchemaAuthor {
  '@type': string;
  name: string;
  url: string;
}

export interface SchemaPublisher {
  '@type': string;
  name: string;
  logo: SchemaLogo;
}

export interface SchemaLogo {
  '@type': string;
  url: string;
  width: number;
  height: number;
}

export interface MainEntityOfPage {
  '@type': string;
  '@id': string;
}

export interface SchemaThing {
  '@type': string;
  name: string;
}

export interface FAQSchema {
  '@context': string;
  '@type': string;
  mainEntity: FAQItem[];
}

export interface FAQItem {
  '@type': string;
  name: string;
  acceptedAnswer: FAQAnswer;
}

export interface FAQAnswer {
  '@type': string;
  text: string;
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  '@type': string;
  position: number;
  name: string;
  item: string;
}

export interface ImageSchema {
  '@context': string;
  '@type': string;
  contentUrl: string;
  description: string;
  creator: SchemaCreator;
  license: string;
  acquireLicensePage: string;
}

export interface SchemaCreator {
  '@type': string;
  name: string;
}

export interface SpeakableSchema {
  '@context': string;
  '@type': string;
  speakable: SpeakableSpecification;
  url: string;
}

export interface SpeakableSpecification {
  '@type': string;
  cssSelector: string[];
}

// URL Data Types
export interface UrlData {
  slug: string;
  path_structure: string;
  canonical_url: string;
  alternate_urls: AlternateUrl[];
  parameters: UrlParameters;
}

export interface AlternateUrl {
  lang: string;
  path: string;
}

export interface UrlParameters {
  recommended: string[];
  avoid: string[];
}

// Entity Data Types
export interface EntityData {
  primary_entities: Entity[];
  secondary_entities: Entity[];
}

export interface Entity {
  name: string;
  type: string;
  identifiers: Record<string, string>;
  role: string;
  description?: string;
  mentions: number;
}

// Content Structure Types
export interface ContentStructure {
  h1: string;
  sections: Section[];
  recommendations: Recommendations;
}

export interface Section {
  id: string;
  h2: string;
  type: string;
  children: SubSection[];
}

export interface SubSection {
  id: string;
  h3: string;
  type: string;
}

export interface Recommendations {
  missing_headings: string[];
  reorder_suggestions: string[];
  format_improvements: string[];
}

// Blog Service for Next.js
export class BlogService {
  private apiUrl: string;

  constructor(baseUrl: string) {
    this.apiUrl = `${baseUrl}/api/blogs`;
  }

  async getBlogs(): Promise<Blog[]> {
    try {
      const response = await fetch(this.apiUrl);
      const data: BlogResponse = await response.json();
      return data.blogs;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  async getBlogById(id: number): Promise<Blog | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const data: Blog = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching blog with id ${id}:`, error);
      return null;
    }
  }

  // Add more methods as needed for your application
}

// Example usage in a Next.js API route or component:
/*
  import { BlogService, Blog } from '@/types/blog-types';
  
  // In a Next.js API route
  export default async function handler(req, res) {
    const blogService = new BlogService(process.env.API_BASE_URL);
    const blogs = await blogService.getBlogs();
    res.status(200).json(blogs);
  }
  
  // In a component
  export async function getServerSideProps() {
    const blogService = new BlogService(process.env.API_BASE_URL);
    const blogs = await blogService.getBlogs();
    
    return {
      props: {
        blogs,
      },
    };
  }
  */
