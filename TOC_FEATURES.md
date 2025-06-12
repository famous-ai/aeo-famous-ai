# Table of Contents (TOC) Features

## ✅ What's Fixed (v1.0.0+)

### 🔗 Working Anchor Navigation
- **Auto ID Injection**: Headings automatically get `id` attributes
- **Clean Slugs**: "Introduction" becomes `id="introduction"`
- **Clickable TOC**: Links like `#introduction` now scroll to headings
- **SSR Compatible**: Works in Next.js server and client environments

### 🎯 Smart Heading Detection
- **H1 & H2 Only**: Cleaner TOC by focusing on main sections
- **No Overwhelming Lists**: Reduces 21+ headings to 4-6 clean entries
- **Duplicate Handling**: Unique IDs even with duplicate headings

### 🛠️ Robust Parsing
- **Cheerio-based**: Proper HTML parsing instead of fragile regex
- **Content Extraction**: Avoids HTML/head/body wrapper issues
- **Error Handling**: Graceful fallbacks if parsing fails

## 📋 How It Works

```tsx
// Input HTML from your API:
<div>
  <h1>Article Title</h1>
  <h2>Introduction</h2>
  <h2>Key Benefits</h2>
</div>

// SDK automatically transforms to:
<div>
  <h1 id="article-title">Article Title</h1>
  <h2 id="introduction">Introduction</h2>
  <h2 id="key-benefits">Key Benefits</h2>
</div>

// And generates TOC:
[
  { id: "article-title", title: "Article Title", anchor: "#article-title", level: 1 },
  { id: "introduction", title: "Introduction", anchor: "#introduction", level: 2 },
  { id: "key-benefits", title: "Key Benefits", anchor: "#key-benefits", level: 2 }
]
```

## 🚀 Usage Examples

### Basic TOC (Auto-styled)
```tsx
<BlogArticleTemplate blog={blog} />
// TOC is included automatically if you provide renderTOC
```

### Custom TOC Styling
```tsx
<BlogArticleTemplate 
  blog={blog}
  renderTOC={(toc) => (
    <nav className="my-toc">
      <h3>Contents</h3>
      {toc.map(item => (
        <a 
          key={item.id} 
          href={item.anchor}
          className={`toc-level-${item.level}`}
        >
          {item.title}
        </a>
      ))}
    </nav>
  )}
/>
```

### Sticky TOC Sidebar
```tsx
<div className="article-layout">
  <aside className="toc-sidebar sticky top-4">
    {enhanced.tableOfContents.length > 0 && (
      <nav>
        <h3>Table of Contents</h3>
        {enhanced.tableOfContents.map(item => (
          <a 
            key={item.id}
            href={item.anchor}
            className={`
              block py-1 px-2 text-sm hover:bg-gray-100
              ${item.level === 1 ? 'font-semibold' : 'ml-4 text-gray-600'}
            `}
          >
            {item.title}
          </a>
        ))}
      </nav>
    )}
  </aside>
  
  <main className="article-content">
    <BlogArticleTemplate blog={blog} hideHeader={true} />
  </main>
</div>
```

## 🐛 Debugging TOC Issues

### 1. Check Content Structure
```tsx
console.log('Blog content preview:', blog.content?.substring(0, 200));
console.log('Has H1:', blog.content?.includes('<h1'));
console.log('Has H2:', blog.content?.includes('<h2'));
```

### 2. Use Debug Utility
```tsx
'use client';
import { debugTOCGeneration } from 'famous-ai';

useEffect(() => {
  debugTOCGeneration(blog.content, 'Development');
}, [blog]);
```

### 3. Expected Debug Output
```
🔍 TOC Debug - Environment: Development
📥 Input: { contentLength: 5240, hasH1: true, hasH2: true }
📤 Output: { tocCount: 4, contentModified: true }
✅ Content was modified (IDs injected)
```

## ❌ Common Issues & Solutions

### Issue: "No TOC items found"
**Cause**: Content doesn't contain `<h1>` or `<h2>` tags
**Solution**: Check if your API content uses different heading structure

### Issue: "TOC generated but links don't scroll"
**Cause**: IDs weren't injected (content unchanged)
**Solution**: Use `debugTOCGeneration()` to identify parsing errors

### Issue: "Too many TOC items (overwhelming)"
**Solution**: This is fixed in v1.0.0+ - only H1/H2 are included

### Issue: "HTML wrapper contamination"
**Cause**: Old versions used `$.html()` which added `<html><head><body>`
**Solution**: Upgrade to v1.0.0+ which uses smart content extraction

## 🎨 TOC Design Ideas

### Minimal Clean TOC
```css
.toc-minimal {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.toc-minimal a {
  display: block;
  padding: 0.5rem 0;
  color: #495057;
  text-decoration: none;
  border-left: 3px solid transparent;
}

.toc-minimal a:hover {
  color: #007bff;
  border-left-color: #007bff;
  padding-left: 0.5rem;
}
```

### Numbered TOC
```tsx
renderTOC={(toc) => (
  <ol className="numbered-toc">
    {toc.filter(item => item.level === 2).map((item, index) => (
      <li key={item.id}>
        <a href={item.anchor}>
          {index + 1}. {item.title}
        </a>
      </li>
    ))}
  </ol>
)}
```

### Progress TOC (Advanced)
```tsx
const [activeSection, setActiveSection] = useState('');

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  });
  
  toc.forEach(item => {
    const element = document.getElementById(item.id);
    if (element) observer.observe(element);
  });
  
  return () => observer.disconnect();
}, [toc]);
```

## 🔧 Technical Details

### ID Generation Rules
1. Convert to lowercase
2. Replace spaces with hyphens
3. Remove special characters
4. Handle duplicates with counters (`heading-1`, `heading-2`)
5. Fallback to `heading-{level}` for empty titles

### Cheerio Configuration
```tsx
const $ = cheerio.load(htmlContent, {
  xml: false, // HTML mode for better compatibility
});
```

### Content Extraction Strategy
```tsx
// 1. Try body content first
const bodyContent = $('body').html();

// 2. Fallback to root elements
const rootElements = $.root().children();

// 3. Last resort: full HTML (may include wrappers)
const fullHTML = $.html();
```

This ensures clean content extraction across different HTML structures and environments.