'use client';

export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, token, isLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState(1);
  const [postcodeLoading, setPostcodeLoading] = useState(false);
  const postcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const savedCart = localStorage.getItem('kathir-cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCart(items);
    }

    return () => {
      if (postcodeTimeoutRef.current) {
        clearTimeout(postcodeTimeoutRef.current);
      }
    };
  }, [isAuthenticated, isLoading, router]);

  const lookupPostcode = async (postcode: string) => {
    if (!postcode.trim() || postcode.length < 5) return;

    setPostcodeLoading(true);
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`);
      if (response.ok) {
        const data = await response.json();
        const result = data.result;

        setFormData(prev => ({
          ...prev,
          shippingCity: result.admin_district || result.district || '',
          shippingState: result.region || result.admin_county || '',
        }));
      }
    } catch (error) {
      console.error('Postcode lookup failed:', error);
    } finally {
      setPostcodeLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === 'shippingZip' && value.trim().length >= 5) {
      if (postcodeTimeoutRef.current) {
        clearTimeout(postcodeTimeoutRef.current);
      }
      postcodeTimeoutRef.current = setTimeout(() => {
        lookupPostcode(value);
      }, 500);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('kathir-cart', JSON.stringify(updatedCart));
  };

  const handleEditQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem('kathir-cart', JSON.stringify(updatedCart));
    setEditingId(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
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
        const errorData = await res.json();
        setError(errorData.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Error during checkout');
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

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

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
                    <div className="relative">
                      <input
                        type="text"
                        name="shippingZip"
                        value={formData.shippingZip}
                        onChange={handleChange}
                        required
                        placeholder="e.g., SW1A 1AA"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        style={{ borderColor: '#E5E7EB' }}
                      />
                      {postcodeLoading && (
                        <div className="absolute right-4 top-3">
                          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {postcodeLoading && (
                      <p className="text-xs text-blue-600 mt-1">Looking up address...</p>
                    )}
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
                  {loading ? 'Processing...' : 'Place Order'}
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
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="text-gray-700 font-medium">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingId === item.id ? (
                          <>
                            <input
                              type="number"
                              min="1"
                              value={editingQty}
                              onChange={(e) => setEditingQty(parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <button
                              onClick={() => handleEditQuantity(item.id, editingQty)}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-600 font-medium min-w-fit">Qty: {item.quantity}</span>
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setEditingQty(item.quantity);
                              }}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
