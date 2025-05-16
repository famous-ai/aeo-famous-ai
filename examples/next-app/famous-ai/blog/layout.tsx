import 'famous-ai/dist/index.css';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-container">
      <h1 className="blog-header">Our Blog</h1>
      {children}
    </div>
  );
}
