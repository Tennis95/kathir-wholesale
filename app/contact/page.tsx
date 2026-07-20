'use client';

export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="bg-white/95 backdrop-blur border-b py-3" style={{ borderColor: '#E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 text-sm">
          <a href="/" className="text-sky-600 hover:underline font-medium">Home</a>
          <span className="text-gray-400 mx-2">/</span>
          <span style={{ color: '#2D7BA8' }} className="font-semibold">Contact</span>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="bg-white shadow-md border-b"
        style={{ borderColor: '#E5E7EB' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <motion.h1
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ color: '#1F2937', letterSpacing: '-1px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We're here to help. Reach out to our team and we'll respond as quickly as possible.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form - Takes 2 columns on desktop */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div
              className="bg-white rounded-2xl p-10 md:p-12 shadow-lg transition-all duration-300"
              style={{ boxShadow: '0 10px 40px rgba(79, 169, 217, 0.1)' }}
            >
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1F2937', letterSpacing: '-0.5px' }}>
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8 text-sm">
                Have a question or inquiry? Fill out the form below and our team will get back to you within 24 business hours.
              </p>
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                  ✓ Thank you for your message! We'll be in touch shortly.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block font-semibold mb-3 text-sm" style={{ color: '#2D7BA8', letterSpacing: '0.3px' }}>
                      Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium"
                      style={{
                        borderColor: focusedField === 'name' ? '#2D7BA8' : '#E5E7EB',
                        background: focusedField === 'name' ? '#F0F9FE' : '#FFFFFF',
                        boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(45, 123, 168, 0.1)' : 'none'
                      }}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block font-semibold mb-3 text-sm" style={{ color: '#2D7BA8', letterSpacing: '0.3px' }}>
                      Email <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium"
                      style={{
                        borderColor: focusedField === 'email' ? '#2D7BA8' : '#E5E7EB',
                        background: focusedField === 'email' ? '#F0F9FE' : '#FFFFFF',
                        boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(45, 123, 168, 0.1)' : 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block font-semibold mb-3 text-sm" style={{ color: '#2D7BA8', letterSpacing: '0.3px' }}>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium"
                    style={{
                      borderColor: focusedField === 'phone' ? '#2D7BA8' : '#E5E7EB',
                      background: focusedField === 'phone' ? '#F0F9FE' : '#FFFFFF',
                      boxShadow: focusedField === 'phone' ? '0 0 0 3px rgba(45, 123, 168, 0.1)' : 'none'
                    }}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block font-semibold mb-3 text-sm" style={{ color: '#2D7BA8', letterSpacing: '0.3px' }}>
                    Subject <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium"
                    style={{
                      borderColor: focusedField === 'subject' ? '#2D7BA8' : '#E5E7EB',
                      background: focusedField === 'subject' ? '#F0F9FE' : '#FFFFFF',
                      boxShadow: focusedField === 'subject' ? '0 0 0 3px rgba(45, 123, 168, 0.1)' : 'none'
                    }}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block font-semibold mb-3 text-sm" style={{ color: '#2D7BA8', letterSpacing: '0.3px' }}>
                    Message <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium resize-none"
                    style={{
                      borderColor: focusedField === 'message' ? '#2D7BA8' : '#E5E7EB',
                      background: focusedField === 'message' ? '#F0F9FE' : '#FFFFFF',
                      boxShadow: focusedField === 'message' ? '0 0 0 3px rgba(45, 123, 168, 0.1)' : 'none'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-4 font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-102 text-lg disabled:opacity-75 disabled:cursor-not-allowed"
                  style={{
                    background: submitted ? '#10B981' : 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                    boxShadow: submitted ? '0 6px 20px rgba(16, 185, 129, 0.25)' : '0 6px 20px rgba(45, 123, 168, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    if (!submitted) {
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(45, 123, 168, 0.35)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitted) {
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(45, 123, 168, 0.25)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {submitted ? '✓ Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            {/* Head Office Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 cursor-pointer"
              style={{ boxShadow: '0 4px 20px rgba(79, 169, 217, 0.08)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 169, 217, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 169, 217, 0.08)';
              }}
            >
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#2D7BA8', letterSpacing: '-0.5px' }}>
                Head Office
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                <span style={{ color: '#1F2937', fontWeight: '600' }}>KATHIR LTD</span><br/>
                Warehouse & Distribution Center<br/>
                Unit 5, Industrial Estate<br/>
                Warrington, Cheshire WA5 6TE<br/>
                United Kingdom
              </p>
            </motion.div>

            {/* Contact Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 cursor-pointer"
              style={{ boxShadow: '0 4px 20px rgba(79, 169, 217, 0.08)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 169, 217, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 169, 217, 0.08)';
              }}
            >
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-5" style={{ color: '#2D7BA8', letterSpacing: '-0.5px' }}>
                Contact Details
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">
                  <span style={{ color: '#1F2937', fontWeight: '600' }}>Phone:</span><br/>
                  +44 (0) 1925 XXX XXX
                </p>
                <p className="text-gray-600">
                  <span style={{ color: '#1F2937', fontWeight: '600' }}>Email:</span><br/>
                  orders@kathir.co.uk
                </p>
                <p className="text-gray-600">
                  <span style={{ color: '#1F2937', fontWeight: '600' }}>Hours:</span><br/>
                  Mon-Fri: 8AM-6PM<br/>
                  Sat: 9AM-2PM
                </p>
              </div>
            </motion.div>

            {/* Response Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 cursor-pointer"
              style={{ boxShadow: '0 4px 20px rgba(79, 169, 217, 0.08)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 169, 217, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 169, 217, 0.08)';
              }}
            >
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#2D7BA8', letterSpacing: '-0.5px' }}>
                Response Time
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                We aim to respond to all inquiries within <span style={{ color: '#2D7BA8', fontWeight: '600' }}>24 business hours</span>. For urgent matters, please call us directly.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-gray-200"
        >
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1F2937' }}>
              Why Choose KATHIR?
            </h2>
            <p className="text-gray-600 max-w-2xl">
              With over 20 years of experience in wholesale distribution, we're committed to providing the highest quality products and exceptional service to our customers across the UK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: 'Premium Quality', desc: 'Carefully sourced authentic groceries' },
              { icon: '✓', title: 'Verified Products', desc: 'All items meet food safety standards' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Reliable shipping across the UK' },
              { icon: '💼', title: 'Professional Service', desc: '20+ years of wholesale expertise' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#2D7BA8' }}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
