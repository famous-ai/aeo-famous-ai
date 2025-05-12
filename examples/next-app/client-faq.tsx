import { useClientFAQ, FAQRenderer, customizeFAQ } from 'famous-ai';
import { useState } from 'react';
import styles from '../styles/FaqPage.module.css';

export default function ClientFAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch FAQs client-side
  const { faqs, loading, error, refetch } = useClientFAQ({
    apiUrl: 'https://your-backend-api.com/api/faqs',
    // Optional: Add custom headers if needed
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
    }
  });

  // Filter FAQs based on search term
  const filteredFaqs = customizeFAQ(faqs, {
    searchTerm,
  });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.faqContainer}>
          {loading ? (
            <p>Loading FAQs...</p>
          ) : error ? (
            <div className={styles.error}>
              <p>Error loading FAQs: {error.message}</p>
              <button onClick={refetch} className={styles.retryButton}>
                Try Again
              </button>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <p>No FAQs found matching "{searchTerm}"</p>
          ) : (
            <FAQRenderer faqs={filteredFaqs} />
          )}
        </div>
      </main>
    </div>
  );
}