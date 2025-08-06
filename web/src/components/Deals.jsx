import { useEffect, useState, useCallback } from "react";
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
          endsIn: 2 * 60 * 60, // 2 hours
          rating: 4,
        },
        {
          id: 2,
          name: "Chocolate Chip Cookies",
          price: "₹149",
          oldPrice: "₹229",
          image: `${process.env.PUBLIC_URL}/img/chocolate-chip-cookies.png`,
          endsIn: 90 * 60, // 1.5 hours
          rating: 5,
        },
        {
          id: 3,
          name: "Cashew Nuts (1kg)",
          price: "₹749",
          oldPrice: "₹999",
          image: `${process.env.PUBLIC_URL}/img/cashew-nuts.png`,
          endsIn: 45 * 60, // 45 minutes
          rating: 3,
        },
      ]);
    }, 1000);
  });
};

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Deals() {
  const { addToCart, toggleCart, showToast } = useAppContext();

  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

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

    const refreshInterval = setInterval(() => {
      loadDeals();
    }, 60 * 1000);

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

  const handleGrabDeal = (deal) => {
    addToCart({
      id: deal.id,
      title: deal.name,
      price: parseInt(deal.price.replace("₹", "")),
      quantity: 1,
      image: deal.image,
    });

    showToast(`${deal.name} added to cart!`, "success");

    // 🛠 Fix: delay cart opening to avoid "Your cart is empty"
    setTimeout(() => {
      toggleCart(true);
    }, 100);
  };

  const activeDeals = deals.filter((deal) => timeLeft[deal.id] > 0);

  return (
    <section className="px-4 py-8">
      <ToastContainer position="top-right" autoClose={1500} />

      <div className="flex justify-center items-center mb-6">
        <h2 className="text-2xl font-bold text-[#5E936C] text-center relative after:block after:h-1 after:w-16 after:bg-[#93DA97] after:mx-auto after:mt-2">
          <div className="flex justify-center items-center gap-2">
            <FaBolt className="text-yellow-500 animate-pulse" />
            Deals of the Day
          </div>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {activeDeals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-gradient-to-br from-white via-[#E8FFD7] to-[#93DA97] rounded-2xl shadow-md hover:shadow-lg transition p-3 relative group text-sm"
          >
            {/* Discount badge */}
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
              {Math.round(
                ((parseInt(deal.oldPrice.replace("₹", "")) -
                  parseInt(deal.price.replace("₹", ""))) /
                  parseInt(deal.oldPrice.replace("₹", ""))) *
                  100
              )}
              % OFF
            </div>

            {/* Ending Soon badge */}
            {timeLeft[deal.id] < 1800 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
                ⏰ Ending Soon
              </div>
            )}

            {/* Image */}
            <div className="rounded-xl overflow-hidden mb-2">
              <img
                src={deal.image}
                alt={deal.name}
                className="w-full h-32 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-800 mb-1">{deal.name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-1 text-yellow-500 text-xs mb-1">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={i < deal.rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>

            {/* Price */}
            <p className="text-[#3E5F44] font-bold">
              {deal.price}
              <span className="text-gray-600 line-through text-xs ml-1">
                {deal.oldPrice}
              </span>
            </p>

            {/* Countdown */}
            <p className="text-xs text-gray-700 mt-1">
              Ends in:{" "}
              <span className="font-semibold text-gray-900">
                {formatTime(timeLeft[deal.id])}
              </span>
            </p>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 rounded mt-2">
              <div
                className="h-1 bg-green-500 rounded"
                style={{
                  width: `${(timeLeft[deal.id] / deal.endsIn) * 100}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>

            {/* Grab Deal Button */}
            <button
              onClick={() => handleGrabDeal(deal)}
              className="mt-3 w-full bg-gradient-to-r from-[#5E936C] to-[#93DA97] hover:from-[#93DA97] hover:to-[#5E936C] text-white py-1.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <FaBolt className="text-xs" />
              Grab Deal
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
