# Famous AI - Headless CMS for Next.js

A headless CMS package for Next.js that fetches FAQ data from your API and renders it statically at build time.

## Installation

```bash
npm install famous-ai
# or
yarn add famous-ai
```

## Usage

### Setting up Static Generation

In your Next.js project, create a page that will render your FAQs:

```tsx
// pages/faq.tsx
import { GetStaticProps } from 'next';
import { FAQRenderer, generateStaticFAQ, FAQ } from 'famous-ai';

interface FAQPageProps {
  faqs: FAQ[];
}

export default function FAQPage({ faqs }: FAQPageProps) {
  return (
    <div className="container">
      <h1>Frequently Asked Questions</h1>
      <FAQRenderer faqs={faqs} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { faqs } = await generateStaticFAQ({
    apiUrl: 'https://your-backend-api.com/api/faqs',
    // Optional: Add custom headers if needed
    // headers: {
    //   'Authorization': 'Bearer YOUR_TOKEN'
    // }
  });

  return {
    props: {
      faqs,
    },
    // Optional: enable ISR with a revalidation period
    revalidate: 3600, // Revalidate every hour
  };
};
```

### Styling

The FAQ renderer component uses class names with the `famousai-` prefix that you can target with your own CSS:

```css
/* styles/faq.css */
.famousai-faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.famousai-faq-item {
  margin-bottom: 24px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 16px;
}

.famousai-faq-question {
  font-weight: 600;
  margin-bottom: 8px;
}

.famousai-faq-answer p {
  margin-bottom: 16px;
}
```

## API

### Components

- `FAQRenderer`: A React component that renders FAQ items

### Utilities

- `fetchFaqs`: Fetches FAQ data from an API endpoint
- `generateStaticFAQ`: Utility for Next.js static site generation

### Types

- `FAQ`: Interface for FAQ item (question and answer)
- `FAQResponse`: Interface for API response containing FAQs
- `FetchOptions`: Options for API requests
- `FAQRendererProps`: Props for the FAQRenderer component

## License

MIT