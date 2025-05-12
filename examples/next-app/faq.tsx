import { GetStaticProps } from 'next';
import { 
  FAQAccordion, 
  generateStaticFAQ, 
  FAQ, 
  customizeFAQ 
} from 'famous-ai';
import styles from '../styles/FaqPage.module.css';

interface FAQPageProps {
  faqs: FAQ[];
}

export default function FAQPage({ faqs }: FAQPageProps) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <p className={styles.description}>
          Find answers to common questions about our services
        </p>
        
        <div className={styles.faqContainer}>
          <FAQAccordion faqs={faqs} className={styles.customFaq} />
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Fetch all FAQs from the API
  const { faqs } = await generateStaticFAQ({
    apiUrl: 'https://your-backend-api.com/api/faqs',
    // Optional: Add custom headers if needed
    headers: {
      'x-api-key': process.env.API_KEY || '',
    }
  });

  // Customize FAQs - you can filter, sort, limit, etc.
  const customizedFaqs = customizeFAQ(faqs, {
    // Example: Sort by question length (shorter questions first)
    sortFn: (a, b) => a.question.length - b.question.length,
    // Example: Limit to 10 FAQs
    limit: 10,
  });

  return {
    props: {
      faqs: customizedFaqs,
    },
    // Revalidate every 24 hours
    revalidate: 86400,
  };
}