'use client';

export const dynamic = 'force-dynamic';
import { useState } from 'react';

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, bank transfers, and digital wallets. All payments are secure and encrypted.'
    },
    {
      question: 'What is the minimum order value?',
      answer: 'There is no minimum order value. You can order as little as 1 unit. However, bulk orders qualify for additional discounts.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-3 business days across the UK. Express delivery (same-day) is available for orders placed before 2 PM.'
    },
    {
      question: 'Are your products fresh and quality assured?',
      answer: 'Yes! All our products are sourced from trusted suppliers and are ISO 9001 certified. We ensure premium quality at every step.'
    },
    {
      question: 'Can I return products?',
      answer: 'Yes, we offer a 7-day return policy for unopened products. Contact our support team for the return process.'
    },
    {
      question: 'Do you offer wholesale discounts?',
      answer: 'Absolutely! Bulk orders of 10+ units qualify for special wholesale pricing. Contact us for custom quotes.'
    },
  ];

  return (
    <div style={{ background: '#8FD3F4', minHeight: '100vh' }}>
      <div className="bg-white border-b py-3" style={{ borderColor: '#8FD3F4' }}>
        <div className="max-w-7xl mx-auto px-4 text-sm">
          <a href="/" className="text-sky-600 hover:underline">Home</a>
          <span className="text-gray-400 mx-2">/</span>
          <span style={{ color: '#1F2937' }} className="font-semibold">FAQs</span>
        </div>
      </div>

      <div className="bg-white shadow-md border-b-2" style={{ borderColor: '#8FD3F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1F2937' }}>❓ Frequently Asked Questions</h1>
          <p className="text-gray-600 text-lg">Find answers to common questions about our service</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 text-left font-bold flex items-center justify-between transition hover:bg-gray-50"
                style={{ color: '#1F2937' }}
              >
                {faq.question}
                <span className="text-2xl">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-6 py-4 border-t" style={{ borderColor: '#8FD3F4', background: '#F8FBFF' }}>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2937' }}>Still have questions?</h2>
          <p className="text-gray-600 mb-6">Contact our support team</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 font-bold text-white rounded-lg transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #A0522D 0%, #8B5A3C 100%)', color: 'white' }}
          >
            📞 Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
