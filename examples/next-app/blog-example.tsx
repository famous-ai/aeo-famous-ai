// This file serves as a reference for implementing the Famous AI blog components
// in a Next.js application using the new App Router and render props pattern

/*
// For the blog listing page (app/blog/page.tsx):
import { BlogArticlesTemplate, fetchBlogs } from 'famous-ai';

export const revalidate = 3600; // Revalidate every hour (optional)

export default async function BlogPage() {
  // Fetch data during build
  const response = await fetchBlogs();
  const blogs = response?.blogs || [];

  return (
    <BlogArticlesTemplate
      blogs={blogs}
      loading={false}
      basePath="/blog"
    />
  );
}
*/

// For the individual blog page (app/blog/[slug]/page.tsx):
import { notFound } from 'next/navigation';
import { BlogArticleTemplate, fetchBlogs, fetchBlogBySlug, convertBlogToNextMetadata } from 'famous-ai';
import type { Metadata } from 'next';
import type { TOCItem, InsightItem, SimpleFAQItem, Blog } from 'famous-ai';

// Generate metadata for each blog post (includes FAQ structured data automatically)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await fetchBlogBySlug(params.slug);
  
  if (!blog) {
    return { title: 'Blog Not Found' };
  }
  
  return convertBlogToNextMetadata(blog);
}

// Generate static paths at build time
export async function generateStaticParams() {
  const response = await fetchBlogs();
  const blogs = response?.blogs || [];
  
  return blogs.map((blog: Blog) => ({
    slug: blog.technical_data.url_data.slug,
  }));
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await fetchBlogBySlug(params.slug);
  
  if (!blog) {
    notFound();
  }

  // DEBUG TOC ISSUES: If TOC links aren't working, create a client component with:
  // 'use client';
  // import { useEffect } from 'react';
  // import { debugTOCGeneration } from 'famous-ai';
  // useEffect(() => debugTOCGeneration(blog.content, 'Next.js'), [blog]);

  // Three usage modes demonstrated:

  // MODE 1: STANDALONE (works out of the box)
  // return <BlogArticleTemplate blog={blog} />;

  // MODE 2: SELECTIVE CONTROL (hide what you don't want, keep defaults)
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Your custom header */}
      <header className="mb-8">
        <nav className="text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-blue-600">Home</a>
          {' > '}
          <a href="/blog" className="hover:text-blue-600">Blog</a>
          {' > '}
          <span>{blog.title}</span>
        </nav>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
      </header>

      {/* SDK handles content + enhanced features, hides duplicate elements */}
      <BlogArticleTemplate
        blog={blog}
        hideHeader={true}  // Hide SDK's breadcrumb + title + metadata since we handle above
        basePath="/blog"
        homePath="/"
        
        // Enhanced content with custom styling
        renderTOC={(toc: TOCItem[]) => (
          <aside className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {toc.map((item: TOCItem) => (
                <li key={item.id} className={item.level === 2 ? "font-medium" : "ml-4 text-gray-700"}>
                  <a href={item.anchor} className="hover:text-blue-600">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
        
        renderInsights={(insights: InsightItem[]) => (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Key Insights</h3>
            <ul className="space-y-2">
              {insights.map((insight: InsightItem, index: number) => (
                <li key={index} className="text-blue-800">
                  • {insight.content}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        renderFAQ={(faqs: SimpleFAQItem[]) => (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq: SimpleFAQItem, index: number) => (
                <details key={index} className="border rounded-lg">
                  <summary className="font-medium p-4 cursor-pointer hover:bg-gray-50">
                    {faq.question}
                  </summary>
                  <div className="p-4 pt-0 text-gray-700">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      />

      {/* Your custom footer */}
      <footer className="mt-12 pt-6 border-t">
        <a href="/blog" className="text-blue-600 hover:underline">
          ← Back to all blogs
        </a>
      </footer>
    </div>
  );

  // MODE 3: FULL CONTROL (complete layout customization)
  /*
  return (
    <BlogArticleTemplate
      blog={blog}
      renderLayout={(content, blog) => (
        <div className="custom-blog-layout">
          <header className="custom-header">
            <h1>{blog.title}</h1>
          </header>
          <main className="custom-content">
            {content}
          </main>
          <footer className="custom-footer">
            Custom footer content
          </footer>
        </div>
      )}
      renderFAQ={(faqs) => <CustomFAQComponent faqs={faqs} />}
    />
  );
  */
}