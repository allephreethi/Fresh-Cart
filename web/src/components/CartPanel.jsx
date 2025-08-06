import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function CartPanel() {
  const {
    cartOpen,
    toggleCart,
    cartItems,
    updateQuantity,
    removeFromCart,
  } = useAppContext();

  const navigate = useNavigate();

  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false); // To avoid repeated confetti

  const total = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cartItems]
  );

  const freeShippingThreshold = 1000;
  const shippingCost = total >= freeShippingThreshold ? 0 : 49;
  const shippingProgress = useMemo(
    () => Math.min((total / freeShippingThreshold) * 100, 100),
    [total]
  );

  const finalTotal = useMemo(
    () => (appliedCoupon ? total * (1 - appliedCoupon.discount) : total),
    [total, appliedCoupon]
  );

  const taxRate = 0.05;
  const taxAmount = finalTotal * taxRate;
  const grandTotal = finalTotal + shippingCost + taxAmount;

  const applyCoupon = () => {
    setApplyingCoupon(true);
    setTimeout(() => {
      if (coupon.trim().toLowerCase() === 'save10') {
        setAppliedCoupon({ code: 'SAVE10', discount: 0.1 });
        setCoupon('');
      }
      setApplyingCoupon(false);
    }, 1000);
  };

  // 🎉 Trigger confetti only once when free shipping is reached
  useEffect(() => {
    if (total >= freeShippingThreshold && !hasCelebrated) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setHasCelebrated(true);
    } else if (total < freeShippingThreshold && hasCelebrated) {
      setHasCelebrated(false); // Reset when total drops again
    }
  }, [total, hasCelebrated]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween' }}
          className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-full sm:w-96 max-w-full bg-white shadow-xl z-50 flex flex-col border-l"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <h2 className="text-xl font-semibold tracking-tight">
              Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
            <button
              onClick={() => toggleCart(false)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center mt-20"
              >
                <p>Your cart is empty.</p>
                <button
                  onClick={() => {
                    toggleCart(false);
                    navigate('/products');
                  }}
                  className="mt-4 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Browse Products
                </button>
              </motion.div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                    className="group flex items-start gap-4 p-3 border rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => (e.target.src = '/placeholder.png')}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">₹{item.price}</div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 rounded-md border hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-xs text-gray-600 mt-1">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      {appliedCoupon && (
                        <div className="text-xs text-green-600">
                          Discounted: ₹
                          {(item.price * item.quantity * (1 - appliedCoupon.discount)).toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}

                {/* 🎯 Free Shipping with Progress and Label */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-[#3E5F44]">
                      {total >= freeShippingThreshold
                        ? '✅ Free shipping unlocked!'
                        : `Spend ₹${freeShippingThreshold - total} more to unlock free shipping`}
                    </p>
                    <span className="text-sm font-semibold text-[#5E936C]">
                      {shippingProgress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#E8FFD7] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #5E936C, #93DA97)',
                      }}
                    />
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mt-6">
                  <label className="text-sm font-medium mb-1 block text-gray-700">
                    Apply Coupon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. SAVE10"
                      className="border px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      disabled={applyingCoupon || appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={applyCoupon}
                        disabled={applyingCoupon}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm disabled:opacity-50"
                      >
                        {applyingCoupon ? 'Applying...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="text-green-600 text-sm mt-1">
                      Coupon <strong>{appliedCoupon.code}</strong> applied. You saved ₹
                      {(total * appliedCoupon.discount).toFixed(2)}
                    </p>
                  )}
                  {!appliedCoupon &&
                    coupon &&
                    !applyingCoupon &&
                    coupon.trim().toLowerCase() !== 'save10' && (
                      <p className="text-red-500 text-sm mt-1">Invalid coupon code.</p>
                    )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t bg-white shadow-inner sticky bottom-0 space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Items Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>- ₹{(total * appliedCoupon.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-700">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>GST (5%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-semibold border-t pt-3 mt-2">
                <span>Total Payable</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <button className="w-full mt-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                Proceed to Checkout
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
