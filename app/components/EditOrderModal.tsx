'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EditOrderModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedOrder: any) => void;
  token: string;
}

export default function EditOrderModal({
  order,
  isOpen,
  onClose,
  onSave,
  token,
}: EditOrderModalProps) {
  const [items, setItems] = useState(order?.items || []);
  const [shippingAddress, setShippingAddress] = useState(
    order?.shippingAddress || {}
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_: any, i: number) => i !== index));
  };

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress({ ...shippingAddress, [field]: value });
  };

  const handleSave = async () => {
    if (items.length === 0) {
      setError('Order must have at least one item');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${order._id}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error saving order');
        return;
      }

      onSave(data.order);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Order {order?.orderNumber}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 max-h-96 overflow-y-auto">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                  </div>
                )}

                {/* Items Section */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Items</h3>
                  <div className="space-y-3">
                    {items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          {item.size && (
                            <p className="text-sm text-gray-600">
                              Size: {item.size}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-200"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 font-semibold text-gray-800 min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 font-semibold text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Shipping Address
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={shippingAddress.street || ''}
                      onChange={(e) =>
                        handleAddressChange('street', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={shippingAddress.city || ''}
                        onChange={(e) =>
                          handleAddressChange('city', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={shippingAddress.state || ''}
                        onChange={(e) =>
                          handleAddressChange('state', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Zip Code"
                        value={shippingAddress.zipCode || ''}
                        onChange={(e) =>
                          handleAddressChange('zipCode', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={shippingAddress.country || ''}
                        onChange={(e) =>
                          handleAddressChange('country', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="sticky bottom-0 bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="px-6 py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
