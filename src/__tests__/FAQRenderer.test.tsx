import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FAQRenderer } from '../components/FAQRenderer';

describe('FAQRenderer', () => {
  const mockFaqs = [
    {
      question: 'Test Question 1',
      answer: 'Test Answer 1',
    },
    {
      question: 'Test Question 2',
      answer: 'Test Answer 2\nWith multiple paragraphs',
    },
  ];

  it('should render FAQ questions and answers', () => {
    const { getByText } = render(<FAQRenderer faqs={mockFaqs} />);
    
    // Check if questions are rendered
    expect(getByText('Test Question 1')).toBeInTheDocument();
    expect(getByText('Test Question 2')).toBeInTheDocument();
    
    // Check if answers are rendered
    expect(getByText('Test Answer 1')).toBeInTheDocument();
    expect(getByText('Test Answer 2')).toBeInTheDocument();
    expect(getByText('With multiple paragraphs')).toBeInTheDocument();
  });

  it('should render empty state when no FAQs provided', () => {
    const { container } = render(<FAQRenderer faqs={[]} />);
    
    // The component should render without errors, but have no FAQ items
    const faqList = container.querySelector('.famousai-faq-list');
    expect(faqList).toBeInTheDocument();
    expect(faqList?.children.length).toBe(0);
  });

  it('should apply custom className', () => {
    const { container } = render(<FAQRenderer faqs={mockFaqs} className="custom-class" />);
    
    const faqContainer = container.querySelector('.famousai-faq-container');
    expect(faqContainer).toHaveClass('custom-class');
  });
});