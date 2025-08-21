// src/components/CartPanel.jsx
import { X, Trash2, Plus, Minus } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import Checkout from "../pages/Checkout";

export default function CartPanel() {
  const {
    cartOpen,
    toggleCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    user,
    showToast,
    checkoutOpen,
    toggleCheckout,
  } = useAppContext();

  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cartItems]
  );

  const freeShippingThreshold = 1000;
  const shippingCost = total >= freeShippingThreshold ? 0 : 49;
  const taxRate = 0.05;
  const taxAmount = total * taxRate;
  const discountAmount = appliedCoupon ? total * appliedCoupon.discount : 0;
  const grandTotal = total - discountAmount + shippingCost + taxAmount;

  // Confetti effect for free shipping
  useEffect(() => {
    if (total >= freeShippingThreshold && !hasCelebrated) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setHasCelebrated(true);
    } else if (total < freeShippingThreshold && hasCelebrated) {
      setHasCelebrated(false);
    }
  }, [total, hasCelebrated]);

  // Coupon handling
  const exampleCoupons = [
    { code: "SAVE10", discount: 0.1, text: "Save 10%" },
    { code: "SAVE15", discount: 0.15, text: "Save 15%" },
    { code: "FREESHIP", discount: 0, text: "Free Shipping" },
  ];

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const found = exampleCoupons.find((c) => c.code === code);
    if (found) {
      if (found.code === "FREESHIP") {
        showToast("Free shipping applied!", "success");
        setAppliedCoupon({ code, discount: 0 });
      } else {
        setAppliedCoupon({ code, discount: found.discount });
        showToast(`${found.text} applied!`, "success");
      }
      setCoupon("");
    } else {
      showToast("Invalid coupon", "error");
    }
  };

  const handleProceedCheckout = () => {
    if (!user) {
      showToast("Please login to proceed", "error");
      return;
    }
    toggleCart(false);
    toggleCheckout(true);
  };

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-full sm:w-96 max-w-full bg-white shadow-xl z-50 flex flex-col border-l"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h2 className="text-xl font-semibold tracking-tight text-gray-800">
                Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
              <button
                onClick={() => toggleCart(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 text-center mt-20"
                >
                  <p>Your cart is empty.</p>
                  <button
                    onClick={() => toggleCart(false)}
                    className="mt-4 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Browse Products
                  </button>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group flex items-start gap-4 p-3 border rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-800">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1">₹{item.price}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 rounded-md border hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 rounded-md border hover:bg-gray-100 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 font-medium">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-600 transition mt-2"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}

              {/* Free Shipping Bar */}
              {cartItems.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-md text-sm">
                  {total >= freeShippingThreshold
                    ? "🎉 Congratulations! You have free shipping."
                    : `Add ₹${freeShippingThreshold - total} more for free shipping.`}
                  <div className="w-full bg-gray-200 h-2 rounded mt-1">
                    <div
                      className="bg-green-500 h-2 rounded transition-all"
                      style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Coupon Input */}
              {cartItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    Example Coupons:
                    {exampleCoupons.map((c) => (
                      <span
                        key={c.code}
                        className="px-2 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition"
                        onClick={() => setCoupon(c.code)}
                      >
                        {c.code} ({c.text})
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Enter coupon"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="border px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm transition hover:bg-red-600"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm transition hover:bg-green-700"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
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
                    <span>- ₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>GST (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-base font-semibold border-t pt-3 mt-2">
                  <span>Total Payable</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleProceedCheckout}
                  className="w-full mt-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Panel */}
      <Checkout
        isOpen={checkoutOpen}
        onClose={() => toggleCheckout(false)}
        cart={cartItems}
        appliedCoupon={appliedCoupon} // ✅ Pass coupon to Checkout
      />
    </>
  );
}
