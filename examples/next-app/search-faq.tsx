import { GetStaticProps } from 'next';
import { 
  FAQSearch, 
  FAQAccordion,
  generateStaticFAQ, 
  FAQ 
} from 'famous-ai';
import styles from '../styles/FaqPage.module.css';

interface FAQPageProps {
  faqs: FAQ[];
}

export default function SearchFAQPage({ faqs }: FAQPageProps) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <p className={styles.description}>
          Find answers to common questions about our services
        </p>
        
        <div className={styles.faqContainer}>
          <FAQSearch 
            faqs={faqs} 
            placeholder="Search our FAQ knowledge base..."
            renderFAQs={(filteredFaqs) => (
              <FAQAccordion faqs={filteredFaqs} />
            )}
          />
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { faqs } = await generateStaticFAQ({
    apiUrl: 'https://your-backend-api.com/api/faqs',
  });

  return {
    props: {
      faqs,
    },
    revalidate: 86400, // 24 hours
  };
}