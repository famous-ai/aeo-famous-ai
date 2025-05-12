import React from 'react';
import { FAQRendererProps } from '../types';

/**
 * Component for rendering FAQ items
 */
export function FAQRenderer({ faqs, className = '' }: FAQRendererProps) {
  return (
    <div className={`famousai-faq-container ${className}`}>
      <div className="famousai-faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="famousai-faq-item">
            <h3 className="famousai-faq-question">{faq.question}</h3>
            <div className="famousai-faq-answer">
              {faq.answer.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}