import React, { useState } from 'react';
import { FAQRendererProps } from '../types';

/**
 * Component for rendering FAQ items as an accordion
 */
export function FAQAccordion({ faqs, className = '' }: FAQRendererProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`famousai-accordion-container ${className}`}>
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className={`famousai-accordion-item ${openIndex === index ? 'famousai-accordion-active' : ''}`}
        >
          <button 
            className="famousai-accordion-trigger"
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
          >
            <span className="famousai-accordion-title">{faq.question}</span>
            <span className="famousai-accordion-icon">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          <div 
            className="famousai-accordion-content"
            style={{ display: openIndex === index ? 'block' : 'none' }}
          >
            {faq.answer.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}