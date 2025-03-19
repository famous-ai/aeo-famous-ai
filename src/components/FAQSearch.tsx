import React, { useState, useCallback } from 'react';
import { FAQ, FAQRendererProps } from '../types';
import { FAQRenderer } from './FAQRenderer';

interface FAQSearchProps extends FAQRendererProps {
  /** Custom placeholder text for the search input */
  placeholder?: string;
  /** Debounce time in milliseconds */
  debounceTime?: number;
  /** Custom render function for the FAQs */
  renderFAQs?: (filteredFaqs: FAQ[]) => React.ReactNode;
}

/**
 * Component for rendering FAQs with search functionality
 */
export function FAQSearch({
  faqs,
  className = '',
  placeholder = 'Search FAQs...',
  debounceTime = 300,
  renderFAQs,
}: FAQSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new debounce timeout
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, debounceTime);
    
    setSearchTimeout(timeout as any);
  }, [debounceTime, searchTimeout]);

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq => {
    if (!debouncedSearchTerm) return true;
    
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return (
      faq.question.toLowerCase().includes(lowerSearch) ||
      faq.answer.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className={`famousai-search-container ${className}`}>
      <div className="famousai-search-input-wrapper">
        <input
          type="text"
          className="famousai-search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button 
            className="famousai-search-clear"
            onClick={() => {
              setSearchTerm('');
              setDebouncedSearchTerm('');
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      
      {debouncedSearchTerm && filteredFaqs.length === 0 ? (
        <div className="famousai-search-no-results">
          No FAQs found matching "{debouncedSearchTerm}"
        </div>
      ) : renderFAQs ? (
        renderFAQs(filteredFaqs)
      ) : (
        <FAQRenderer faqs={filteredFaqs} />
      )}
    </div>
  );
}