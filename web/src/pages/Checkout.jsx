// src/components/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Home, CreditCard, Wallet, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import confetti from "canvas-confetti";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function Checkout({ isOpen, onClose, appliedCoupon = null }) {
  const navigate = useNavigate();
  const {
    user,
    cartItems,
    setCartItems,      // ✅ To empty cart locally
    showToast,
    toggleCart,
    clearCart,         // Optional: backend sync
  } = useAppContext();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const freeShippingThreshold = 1000;

  // Hide cart when checkout opens
  useEffect(() => {
    if (isOpen) toggleCart(false);
  }, [isOpen]);

  // Fetch user addresses
  useEffect(() => {
    if (!user?.id) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_URL}/addresses/user/${user.id}`);
        const addrList = Array.isArray(res.data) ? res.data : [];
        setAddresses(addrList);
        if (addrList.length > 0) setSelectedAddress(addrList[0].id);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        showToast("Failed to load addresses", "error");
      }
    };

    fetchAddresses();
  }, [user]);

  // Totals
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [cartItems]
  );
  const discountAmount = useMemo(() => (appliedCoupon ? subtotal * appliedCoupon.discount : 0), [appliedCoupon, subtotal]);
  const shipping = useMemo(() => (subtotal >= freeShippingThreshold ? 0 : 49), [subtotal]);
  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = useMemo(() => subtotal - discountAmount + shipping + tax, [subtotal, discountAmount, shipping, tax]);

  const paymentIcons = { COD: <Wallet size={18} />, Card: <CreditCard size={18} />, UPI: <Check size={18} /> };

  // Confirm order
  const handleConfirmOrder = async () => {
    if (!user?.id) return showToast("User not logged in", "error");
    if (!selectedAddress) return showToast("Please select an address", "error");
    if (!cartItems.length) return showToast("Cart is empty", "error");

    setLoading(true);
    try {
      const payload = {
        userId: Number(user.id),
        addressId: Number(selectedAddress),
        paymentMethod,
        total: parseFloat(total.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        items: cartItems.map(item => ({
          productId: Number(item.productId),
          title: String(item.title).slice(0, 255),
          price: parseFloat(Number(item.price).toFixed(2)),
          quantity: Number(item.quantity),
        })),
      };

      const res = await axios.post(`${API_URL}/orders/create`, payload);

      if (res?.data?.order) {
        showToast("Order placed successfully!", "success");

        // ✅ Clear frontend cart immediately
        setCartItems([]);

        // ✅ Optional: sync backend cart clearing
        try {
          await clearCart();
        } catch (err) {
          console.error("Failed to clear backend cart:", err);
        }

        // Confetti
        confetti({
          particleCount: 200,
          spread: 150,
          origin: { y: 0.6 },
          colors: ["#5E936C", "#93DA97", "#E8FFD7", "#FFD700", "#FF69B4"],
          shapes: ["circle", "square"],
          gravity: 0.6,
          ticks: 300,
        });

        onClose();
        navigate("/orders");
      } else {
        showToast("Order failed, please try again", "error");
      }
    } catch (err) {
      console.error("Order failed:", err);
      const message = err?.response?.data?.error || err?.message || "Failed to place order";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-full sm:w-96 bg-white z-50 shadow-xl border-l flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h2 className="text-xl font-semibold tracking-tight text-gray-800">Checkout</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
              {/* Addresses */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700">Select Address</h3>
                {addresses.length ? (
                  <div className="space-y-2">
                    {addresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`flex items-start gap-2 p-3 border rounded-lg cursor-pointer transition ${
                          selectedAddress === addr.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <Home size={20} className="text-green-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-800">{addr.fullName}</p>
                            {selectedAddress === addr.id && <Check size={16} className="text-green-600" />}
                          </div>
                          <p className="text-xs text-gray-600">
                            {addr.street}, {addr.city}, {addr.postalCode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No saved addresses. Add in Account Settings.</p>
                )}
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-700">Payment Method</h3>
                <div className="space-y-2">
                  {Object.keys(paymentIcons).map(method => (
                    <div
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                        paymentMethod === method ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      {paymentIcons[method]}
                      <span className="text-sm text-gray-700">
                        {method === "COD" ? "Cash on Delivery" : method === "Card" ? "Credit/Debit Card" : "UPI"}
                      </span>
                      {paymentMethod === method && <Check size={16} className="text-green-600 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700">Order Summary</h3>
                {cartItems.length ? (
                  <div className="space-y-2">
                    {cartItems.map(item => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center p-3 border rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
                      >
                        <div className="flex gap-3 items-center">
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.title}
                            onError={e => (e.target.src = "/placeholder.png")}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-800">{item.title}</div>
                            <div className="text-xs text-gray-500">
                              {item.quantity} × ₹{Number(item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Your cart is empty.</p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>- ₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t pt-2 mt-2">
                  <span>Total Payable</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-white sticky bottom-0 shadow-t">
              <button
                onClick={handleConfirmOrder}
                disabled={loading || !cartItems.length}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
