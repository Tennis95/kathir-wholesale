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
    shippingStreet: '123 Main Street',
    shippingCity: 'London',
    shippingState: 'London',
    shippingZip: 'SW1A 1AA',
    shippingCountry: 'UK',
    sameAsBilling: true,
    billingStreet: '123 Main Street',
    billingCity: 'London',
    billingState: 'London',
    billingZip: 'SW1A 1AA',
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
        router.push(`/account/orders`);
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#2D7BA8' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="md:col-span-2">
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100"
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
                Shipping Address
              </h2>

              <div className="space-y-6">
                {/* Street */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shippingStreet"
                    value={formData.shippingStreet}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    style={{ borderColor: '#E5E7EB' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State/Region <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shippingState"
                      value={formData.shippingState}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shippingZip"
                      value={formData.shippingZip}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="shippingCountry"
                      value={formData.shippingCountry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      <option>UK</option>
                      <option>USA</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all"
                  style={{
                    background: loading || cart.length === 0 ? '#A0C9E5' : 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                  }}
                >
                  {loading ? 'Processing...' : `Place Order - £${total.toFixed(2)}`}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 h-fit sticky top-24"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 mb-6">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 pb-6 border-b-2" style={{ borderColor: '#E8F4FB' }}>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} x{item.quantity}</span>
                      <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>VAT (20%):</span>
                    <span>£{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t-2" style={{ borderColor: '#E8F4FB', color: '#2D7BA8' }}>
                    <span>Total:</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  💡 Form is pre-filled with test data. Click "Place Order" to proceed.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
