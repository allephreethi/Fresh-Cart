import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
  useEffect(() => {
    // No overflow lock: do NOT freeze background scroll
    // Remove or comment out overflow lock lines

    // Close on ESC key press
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      // No need to reset overflow
      window.removeEventListener("keydown", handleEsc);
    };
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
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[500px] overflow-hidden relative cursor-default
            hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(62,95,68,0.3)] transition-transform duration-300 ease-in-out grid grid-cols-2 gap-8"
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          tabIndex={-1}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 transition transform hover:scale-110"
            aria-label="Close product details"
          >
            <X size={24} />
          </button>

          {/* Left: Image with subtle shadow */}
          <motion.div
            className="flex-shrink-0 w-full max-h-[440px] rounded-lg shadow-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4"
            variants={imageVariants}
          >
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain rounded-lg"
              loading="lazy"
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="flex flex-col overflow-y-auto max-h-[440px] pr-1"
            variants={contentVariants}
          >
            <h2
              id="product-title"
              className="text-2xl font-extrabold text-[#3E5F44] mb-4 truncate"
              title={product.title}
            >
              {product.title}
            </h2>

            <p className="text-base text-gray-700 mb-3 flex-grow overflow-auto">
              {product.description}
            </p>

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
