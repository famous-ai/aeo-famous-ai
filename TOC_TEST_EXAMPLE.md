# TOC Functionality Test

## Example HTML Input:
```html
<h1>Introduction to AI</h1>
<p>Some content...</p>
<h2>Key Benefits</h2>
<p>Benefits content...</p>
<h3>Performance Improvements</h3>
<p>Performance content...</p>
<h2>Implementation Guide</h2>
<p>Guide content...</p>
<h3>Setup Instructions</h3>
<p>Setup content...</p>
<h3>Configuration Options</h3>
<p>Config content...</p>
```

## Expected Output:

### Modified HTML:
```html
<h1 id="introduction-to-ai">Introduction to AI</h1>
<p>Some content...</p>
<h2 id="key-benefits">Key Benefits</h2>
<p>Benefits content...</p>
<h3 id="performance-improvements">Performance Improvements</h3>
<p>Performance content...</p>
<h2 id="implementation-guide">Implementation Guide</h2>
<p>Guide content...</p>
<h3 id="setup-instructions">Setup Instructions</h3>
<p>Setup content...</p>
<h3 id="configuration-options">Configuration Options</h3>
<p>Config content...</p>
```

### Table of Contents:
```json
[
  {
    "id": "introduction-to-ai",
    "title": "Introduction to AI", 
    "anchor": "#introduction-to-ai",
    "level": 1
  },
  {
    "id": "key-benefits",
    "title": "Key Benefits",
    "anchor": "#key-benefits", 
    "level": 2
  },
  {
    "id": "performance-improvements",
    "title": "Performance Improvements",
    "anchor": "#performance-improvements",
    "level": 3
  },
  {
    "id": "implementation-guide", 
    "title": "Implementation Guide",
    "anchor": "#implementation-guide",
    "level": 2
  },
  {
    "id": "setup-instructions",
    "title": "Setup Instructions", 
    "anchor": "#setup-instructions",
    "level": 3
  },
  {
    "id": "configuration-options",
    "title": "Configuration Options",
    "anchor": "#configuration-options", 
    "level": 3
  }
]
```

## Features Implemented:

✅ **Auto-ID Generation**: Slugifies heading text to create URL-friendly IDs  
✅ **Duplicate Handling**: Adds `-1`, `-2` suffixes for duplicate headings  
✅ **Existing ID Preservation**: Doesn't overwrite existing `id` attributes  
✅ **HTML Tag Stripping**: Removes HTML from heading text for clean TOC titles  
✅ **Multi-level Support**: Handles h1-h6 headings with proper level tracking  
✅ **Anchor Links**: Perfect TOC navigation with `#heading-id` anchors  

## Usage:

```tsx
<BlogArticleTemplate 
  blog={blog}
  renderTOC={(toc) => (
    <nav className="table-of-contents">
      <h3>Table of Contents</h3>
      <ul>
        {toc.map(item => (
          <li key={item.id} className={`level-${item.level}`}>
            <a href={item.anchor}>{item.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )}
/>
```

**Result**: Working TOC with clickable navigation links!