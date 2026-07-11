'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'UK',
    sameAsBilling: true,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'UK',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const savedCart = localStorage.getItem('kathir-cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCart(items);
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.2; // 20% VAT
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress: {
            street: formData.shippingStreet,
            city: formData.shippingCity,
            state: formData.shippingState,
            zipCode: formData.shippingZip,
            country: formData.shippingCountry,
          },
          billingAddress: formData.sameAsBilling
            ? {
                street: formData.shippingStreet,
                city: formData.shippingCity,
                state: formData.shippingState,
                zipCode: formData.shippingZip,
                country: formData.shippingCountry,
              }
            : {
                street: formData.billingStreet,
                city: formData.billingCity,
                state: formData.billingState,
                zipCode: formData.billingZip,
                country: formData.billingCountry,
              },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.removeItem('kathir-cart');
        router.push(`/account/orders/${data.order._id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1F2937' }}>Your Cart is Empty</h1>
          <a
            href="/categories"
            className="inline-block px-8 py-3 rounded-lg font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
              boxShadow: '0 4px 12px rgba(45, 123, 168, 0.25)',
            }}
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#1F2937' }}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>Shipping Address</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="shippingStreet"
                  placeholder="Street Address"
                  value={formData.shippingStreet}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
                <input
                  type="text"
                  name="shippingCity"
                  placeholder="City"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
                <input
                  type="text"
                  name="shippingState"
                  placeholder="State/County"
                  value={formData.shippingState}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
                <input
                  type="text"
                  name="shippingZip"
                  placeholder="Postal Code"
                  value={formData.shippingZip}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
                <select
                  name="shippingCountry"
                  value={formData.shippingCountry}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                >
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="IE">Ireland</option>
                </select>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                  boxShadow: '0 4px 12px rgba(45, 123, 168, 0.25)',
                }}
              >
                {loading ? 'Processing...' : '✓ Place Order'}
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-bold">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (20%)</span>
                <span>£{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold" style={{ color: '#2D7BA8' }}>
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
