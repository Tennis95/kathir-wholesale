'use client';

import ShinyText from './ShinyText';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#1F2937', fontFamily: 'var(--font-manrope)' }} className="text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/kathir logo.jpeg"
                alt="KATHIR LTD"
                className="h-11 w-11 object-contain rounded-full"
              />
              <div className="leading-tight">
                <div className="font-bold" style={{ fontSize: '20px' }}>KATHIR LTD</div>
                <p style={{ fontSize: '12px' }}>
                  <ShinyText text="Wholesale Grocery Supplier" color="#FDBA2D" shineColor="#FFF3D6" speed={3} />
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#E5E7EB', opacity: 0.7 }}>
              20+ years of excellence in wholesale distribution of premium agricultural &amp; specialty food products across the UK.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5 tracking-wide" style={{ fontSize: '14px', color: '#FDBA2D' }}>
              QUICK LINKS
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-all duration-300 hover:-translate-y-0.5 inline-block hover:text-[#F59E0B]"
                    style={{ color: '#E5E7EB', opacity: 0.8 }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="font-semibold mb-5 tracking-wide" style={{ fontSize: '14px', color: '#FDBA2D' }}>
              GET IN TOUCH
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#E5E7EB', opacity: 0.8 }}>
              <li>📞 +44 XXX XXX XXXX</li>
              <li>
                <a href="mailto:sales@kathirltd.co.uk" className="transition hover:opacity-100">
                  📧 sales@kathirltd.co.uk
                </a>
              </li>
              <li>🕐 Mon–Fri: 8AM–6PM · Sat: 9AM–2PM</li>
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div>
            <h4 className="font-semibold mb-5 tracking-wide" style={{ fontSize: '14px', color: '#FDBA2D' }}>
              TRUSTED &amp; SECURE
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: '#E5E7EB', opacity: 0.8 }}>
              <li className="flex items-center gap-2"><span style={{ color: '#F59E0B' }}>✓</span> ISO 9001 Certified</li>
              <li className="flex items-center gap-2"><span style={{ color: '#F59E0B' }}>✓</span> Food Safety Standards</li>
              <li className="flex items-center gap-2"><span style={{ color: '#F59E0B' }}>✓</span> VAT Registered</li>
              <li className="flex items-center gap-2"><span style={{ color: '#F59E0B' }}>✓</span> GDPR Compliant</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: '#E5E7EB', opacity: 0.5 }}>
            © 2026 KATHIR LTD. All rights reserved. | Sowing • Reaping • Giving the Best
          </p>
          <div className="flex gap-6 text-xs" style={{ color: '#E5E7EB', opacity: 0.5 }}>
            <a href="#" className="transition hover:opacity-100">Privacy Policy</a>
            <a href="#" className="transition hover:opacity-100">Terms of Service</a>
            <a href="#" className="transition hover:opacity-100">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
