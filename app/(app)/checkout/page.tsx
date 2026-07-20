'use client';

export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { motion } from 'motion/react';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, token, isLoading } = useAuth();
  const { addNotification } = useNotification();
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
        const orderData = data.order;

        addNotification({
          type: 'success',
          title: 'Order Placed Successfully!',
          message: `Your order ${orderData.orderNumber} has been confirmed. Check your email for the invoice.`,
          duration: 6000,
        });

        localStorage.removeItem('kathir-cart');
        setTimeout(() => {
          router.push(`/account/orders/${orderData._id}`);
        }, 1000);
      } else {
        const errorData = await res.json();
        const errorMsg = errorData.message || 'Failed to place order';
        setError(errorMsg);
        addNotification({
          type: 'error',
          title: 'Order Failed',
          message: errorMsg,
          duration: 5000,
        });
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

          {/* Order Summary - Amazon Style */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-fit sticky top-24"
          >
            <h2 className="text-xl font-bold mb-5 pb-4 border-b-2 border-gray-200" style={{ color: '#1F2937' }}>
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Your cart is empty</p>
                <a href="/categories" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                  Continue Shopping
                </a>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-2">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">1 kg per unit</p>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="ml-2 text-gray-400 hover:text-red-600 text-sm font-medium transition"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          {editingId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditQuantity(item.id, Math.max(1, editingQty - 1))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={editingQty}
                                onChange={(e) => setEditingQty(parseInt(e.target.value) || 1)}
                                className="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                              />
                              <button
                                onClick={() => handleEditQuantity(item.id, editingQty + 1)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                              >
                                +
                              </button>
                              <button
                                onClick={() => {
                                  handleEditQuantity(item.id, editingQty);
                                  setEditingId(null);
                                }}
                                className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 ml-2"
                              >
                                Done
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm text-gray-600">Qty: <span className="font-semibold">{item.quantity}</span></span>
                              <button
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditingQty(item.quantity);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-3"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({cart.length})</span>
                    <span className="text-gray-900 font-medium">{cart.length}</span>
                  </div>
                  <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">Calculate at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm pb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span style={{ color: '#1F2937' }}>Total</span>
                    <span style={{ color: '#2D7BA8' }}>Calculated at checkout</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Prices and shipping calculated in checkout
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
