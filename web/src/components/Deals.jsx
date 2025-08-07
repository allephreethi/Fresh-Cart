import { useEffect, useState, useCallback, useMemo } from "react";
import { FaBolt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../context/AppContext";

// Mock API fetch function
const fetchDealsFromAPI = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Premium Almonds (500g)",
          price: "₹399",
          oldPrice: "₹599",
          image: `${process.env.PUBLIC_URL}/img/premium-almonds.png`,
          endsIn: 2 * 60 * 60,
          rating: 4,
        },
        {
          id: 2,
          name: "Chocolate Chip Cookies",
          price: "₹149",
          oldPrice: "₹229",
          image: `${process.env.PUBLIC_URL}/img/chocolate-chip-cookies.png`,
          endsIn: 90 * 60,
          rating: 5,
        },
        {
          id: 3,
          name: "Cashew Nuts (1kg)",
          price: "₹749",
          oldPrice: "₹999",
          image: `${process.env.PUBLIC_URL}/img/cashew-nuts.png`,
          endsIn: 45 * 60,
          rating: 3,
        },
      ]);
    }, 1000);
  });
};

// Format countdown
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}h ${m}m ${s}s`
    : `${m}m ${s}s`;
}

// Dynamic progress bar color
const getProgressColor = (percent) => {
  if (percent > 0.66) return "bg-green-500";
  if (percent > 0.33) return "bg-yellow-500";
  return "bg-red-500";
};

export default function Deals() {
  const { addToCart, toggleCart, showToast, cartItems } = useAppContext();
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [pendingCartItemId, setPendingCartItemId] = useState(null);

  const loadDeals = useCallback(async () => {
    const data = await fetchDealsFromAPI();
    setDeals(data);
    const initialTimers = {};
    data.forEach((deal) => {
      initialTimers[deal.id] = deal.endsIn;
    });
    setTimeLeft(initialTimers);
  }, []);

  useEffect(() => {
    loadDeals();
    const refreshInterval = setInterval(loadDeals, 60000);
    return () => clearInterval(refreshInterval);
  }, [loadDeals]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = {};
        for (let id in prev) {
          updated[id] = prev[id] > 0 ? prev[id] - 1 : 0;
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pendingCartItemId !== null) {
      const exists = cartItems.find((item) => item.id === pendingCartItemId);
      if (exists) {
        toggleCart(true);
        setPendingCartItemId(null);
      }
    }
  }, [cartItems, pendingCartItemId, toggleCart]);

  const handleGrabDeal = (deal) => {
    if (timeLeft[deal.id] <= 0) return;

    addToCart({
      id: deal.id,
      title: deal.name,
      price: parseInt(deal.price.replace("₹", "")),
      quantity: 1,
      image: deal.image,
    });
    showToast(`${deal.name} added to cart!`, "success");
    setPendingCartItemId(deal.id);
  };

  const activeDeals = useMemo(() => {
    return deals.filter((deal) => timeLeft[deal.id] > 0);
  }, [deals, timeLeft]);

  return (
    <section className="px-4 py-10">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* Section heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#5E936C] relative inline-block">
          <FaBolt className="inline-block text-yellow-500 mr-2 animate-pulse" />
          Deals of the Day
          <span className="block w-16 h-1 bg-[#93DA97] mt-2 mx-auto rounded" />
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeDeals.length === 0 ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 rounded-xl animate-pulse"
            />
          ))
        ) : (
          activeDeals.map((deal, index) => {
            const percentLeft = timeLeft[deal.id] / deal.endsIn;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-[#93DA97]/30 p-4 shadow-md hover:shadow-xl transition-all duration-300 relative group"
              >
                {/* Badges */}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  {Math.round(
                    ((parseInt(deal.oldPrice.replace("₹", "")) -
                      parseInt(deal.price.replace("₹", ""))) /
                      parseInt(deal.oldPrice.replace("₹", ""))) *
                      100
                  )}
                  % OFF
                </div>

                {timeLeft[deal.id] < 1800 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow">
                    ⏰ Ending Soon
                  </div>
                )}

                {/* Image */}
                <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center h-32 sm:h-36 p-2 mb-3">
                  <img
                    src={deal.image}
                    alt={`Image of ${deal.name}`}
                    className="max-h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-sm text-gray-800 leading-snug line-clamp-2 mb-1">
                  {deal.name}
                </h3>

                <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      className={i < deal.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>

                <p className="text-[#3E5F44] font-bold text-sm">
                  {deal.price}
                  <span className="text-gray-600 line-through text-xs ml-2">
                    {deal.oldPrice}
                  </span>
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Ends in{" "}
                  <span className="font-semibold text-gray-900">
                    {formatTime(timeLeft[deal.id])}
                  </span>
                </p>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(percentLeft)} transition-all duration-500`}
                    style={{ width: `${percentLeft * 100}%` }}
                  />
                </div>

                {/* Grab Deal Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleGrabDeal(deal)}
                  disabled={timeLeft[deal.id] <= 0}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition ${
                    timeLeft[deal.id] <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#5E936C] to-[#93DA97] text-white shadow hover:from-[#93DA97] hover:to-[#5E936C]"
                  }`}
                  aria-label={`Grab deal: ${deal.name}`}
                >
                  <FaBolt className="text-xs" />
                  {timeLeft[deal.id] <= 0 ? "Expired" : "Grab Deal"}
                </motion.button>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
