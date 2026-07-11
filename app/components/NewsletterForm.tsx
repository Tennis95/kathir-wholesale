'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setEmail('');
      setLoading(false);

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 py-3 rounded-lg text-gray-900 transition focus:shadow-lg bg-white focus:outline-none"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || submitted}
        className="px-6 py-3 font-bold rounded-lg transition transform hover:scale-105 hover:-translate-y-1 whitespace-nowrap disabled:opacity-75"
        style={{ background: submitted ? '#4CAF50' : '#A0522D', color: 'white' }}
      >
        {loading ? 'Subscribing...' : submitted ? '✓ Subscribed!' : 'Subscribe'}
      </button>
    </form>
  );
}
