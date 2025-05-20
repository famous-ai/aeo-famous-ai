import 'famous-ai/dist/index.css';
import { Viewport } from 'next';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-container">
      {children}
    </div>
  );
}
