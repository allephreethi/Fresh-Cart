import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(6px)",
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.2 },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      mass: 0.7,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
  exit: { opacity: 0, scale: 0.85, y: 40, transition: { duration: 0.2 } },
};

const imageVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function ProductDetailModal({ product, onClose }) {
  const {
    addToCart,
    cartItems,
    toggleWishlistItem,
    isInWishlist,
    showToast,
  } = useAppContext();

  const isWishlisted = isInWishlist(product?.id);
  const alreadyInCart = cartItems.some((item) => item.id === product?.id);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 px-4"
        onClick={onClose}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
        aria-modal="true"
        role="dialog"
        aria-labelledby="product-title"
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative cursor-default
            hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(62,95,68,0.3)] transition-transform duration-300 ease-in-out grid grid-cols-1 md:grid-cols-2 gap-6"
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          tabIndex={-1}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 transition transform hover:scale-110"
            aria-label="Close product details"
          >
            <X size={24} />
          </button>

          {/* Left: Image + Wishlist + Cart */}
          <motion.div
            className="flex flex-col items-center justify-between w-full h-full rounded-lg shadow-lg bg-gradient-to-br from-green-50 to-green-100 p-4 relative"
            variants={imageVariants}
          >
            {/* Wishlist */}
            <button
              onClick={() => toggleWishlistItem(product)}
              className="absolute top-3 left-3 text-white bg-[#3E5F44] rounded-full p-1 hover:bg-[#5E936C] transition"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label="Toggle Wishlist"
            >
              <Heart
                size={20}
                fill={isWishlisted ? "#f43f5e" : "none"}
                color={isWishlisted ? "#f43f5e" : "#fff"}
              />
            </button>

            {/* Product Image */}
            <img
              src={product.image}
              alt={product.title}
              className="h-auto max-h-[250px] w-auto object-contain rounded-lg"
              loading="lazy"
            />

            {/* Add to Cart */}
            <button
              onClick={() => {
                if (!alreadyInCart) {
                  addToCart(product);
                  showToast(`${product.title} added to cart`, "success");
                }
              }}
              className={`mt-4 px-4 py-2 rounded-lg shadow transition ${
                alreadyInCart
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#5E936C] text-white hover:bg-[#4b7857]"
              }`}
              disabled={alreadyInCart}
            >
              {alreadyInCart ? "Already in Cart" : "Add to Cart"}
            </button>
          </motion.div>

          {/* Right: Details */}
          <motion.div className="flex flex-col pr-1" variants={contentVariants}>
            <h2
              id="product-title"
              className="text-2xl font-extrabold text-[#3E5F44] mb-4 break-words"
            >
              {product.title}
            </h2>

            <p className="text-base text-gray-700 mb-3">{product.description}</p>

            <div className="text-sm text-gray-600 grid grid-cols-2 gap-3 mb-4">
              <div>
                <strong>Manufacturer:</strong> <br />
                {product.manufacturer || "N/A"}
              </div>
              <div>
                <strong>Origin:</strong> <br />
                {product.origin || "N/A"}
              </div>
              <div>
                <strong>Production Date:</strong> <br />
                {product.productionDate || "N/A"}
              </div>
              <div>
                <strong>Expiry:</strong> <br />
                {product.expiry || "N/A"}
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <strong>Ingredients:</strong>
              <p className="mt-1">{product.ingredients || "N/A"}</p>
            </div>

            {product.nutrition && (
              <div className="text-sm text-gray-700">
                <strong>Nutrition:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Calories: {product.nutrition.calories || "N/A"}</li>
                  <li>Protein: {product.nutrition.protein || "N/A"}</li>
                  <li>Fat: {product.nutrition.fat || "N/A"}</li>
                  <li>Carbohydrates: {product.nutrition.carbs || "N/A"}</li>
                  <li>Vitamins: {product.nutrition.vitamins || "N/A"}</li>
                </ul>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
