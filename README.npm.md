# Famous AI - Headless CMS for Next.js

A headless CMS package for Next.js that fetches FAQ data from your API and renders it statically at build time.

## Features

- 🚀 **Static Site Generation**: Generate FAQ pages at build time
- 🔍 **Search Functionality**: Built-in searchable FAQ components
- 🪗 **Accordion Layout**: Collapsible FAQ items for better UX
- 🔄 **Client-Side Fetching**: Optional real-time FAQ fetching
- 🎨 **Customizable Styling**: Easy to style components
- 🧩 **Customizable Data**: Filter, sort, and transform FAQ data

## Installation

```bash
npm install famous-ai
# or
yarn add famous-ai
```

## Usage

### Static Generation

```tsx
// pages/faq.tsx
import { GetStaticProps } from 'next';
import { FAQAccordion, generateStaticFAQ, FAQ } from 'famous-ai';

export default function FAQPage({ faqs }) {
  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      <FAQAccordion faqs={faqs} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { faqs } = await generateStaticFAQ({
    apiUrl: 'https://your-api.com/faqs',
  });
  
  return {
    props: { faqs },
    revalidate: 3600, // Optional: revalidate every hour
  };
};
```

### Client-Side Fetching with Search

```tsx
import { useClientFAQ, FAQSearch } from 'famous-ai';

export default function ClientFAQPage() {
  const { faqs, loading, error } = useClientFAQ({
    apiUrl: 'https://your-api.com/faqs',
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      <h1>Search our FAQs</h1>
      <FAQSearch faqs={faqs} />
    </div>
  );
}
```

## Components

- **FAQRenderer**: Basic FAQ renderer
- **FAQAccordion**: Collapsible accordion-style FAQ component
- **FAQSearch**: Search-enabled FAQ component

## Styling

The components use namespaced class names with the `famousai-` prefix for easy styling:

```css
/* Custom styles */
.famousai-accordion-container {
  background: #f9f9f9;
  border-radius: 8px;
}

.famousai-accordion-title {
  color: #0070f3;
}
```

## License

MIT