// src/pages/Products.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaHeart, FaPlus, FaMinus, FaStar } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import ProductDetailModal from "../components/ProductDetailModal";

const productList = [
  {
    id: 1,
    title: "Fresh Apples (1kg)",
    price: 150,
    originalPrice: 200,
    quantity: "1kg",
    rating: 4.3,
    image: `${process.env.PUBLIC_URL}/img/fresh-apples.png`,
    description: "Crisp and sweet apples, farm fresh and organically grown.",
    manufacturer: "Organic Farms Co.",
    address: "45 Orchard Road, Shimla, India",
    origin: "India",
    productionDate: "2025-07-10",
    ingredients: "Fresh Apples",
    expiry: "Best before 10 days. Keep refrigerated.",
    nutrition: {
      calories: "52 kcal",
      protein: "0.3g",
      fat: "0.2g",
      carbs: "14g",
      vitamins: "Vitamin C, A",
    },
  },
  {
    id: 2,
    title: "Amul Milk 1L Pack",
    price: 65,
    quantity: "1L",
    rating: 4.6,
    image: `${process.env.PUBLIC_URL}/img/amul-milk.png`,
    description: "Toned milk for your daily nutrition and health needs.",
    manufacturer: "Amul Dairy",
    address: "Gujarat, India",
    origin: "India",
    productionDate: "2025-07-01",
    ingredients: "Toned Milk",
    expiry: "Best before 7 days. Refrigerate after opening.",
    nutrition: {
      calories: "42 kcal",
      protein: "3.4g",
      fat: "1g",
      carbs: "5g",
      vitamins: "Vitamin D, B12",
    },
  },
  {
    id: 3,
    title: "Farm Fresh Eggs (12 pcs)",
    price: 90,
    originalPrice: 110,
    quantity: "12 pcs",
    rating: 4.4,
    image: `${process.env.PUBLIC_URL}/img/farm-fresh-eggs.png`,
    description: "High-protein fresh eggs straight from healthy farms.",
    manufacturer: "Healthy Farm Eggs Ltd.",
    address: "123 Green Valley, Punjab, India",
    origin: "India",
    productionDate: "2025-07-05",
    ingredients: "Fresh Chicken Eggs",
    expiry: "Best before 21 days from production. Store in refrigerator.",
    nutrition: {
      calories: "155 kcal",
      protein: "13g",
      fat: "11g",
      carbs: "1.1g",
      vitamins: "Vitamin A, D, B12",
    },
  },
  {
    id: 4,
    title: "Dry Fruits Mix (500g)",
    price: 399,
    originalPrice: 450,
    quantity: "500g",
    rating: 4.1,
    image: `${process.env.PUBLIC_URL}/img/dry-fruits-mix.png`,
    description: "A nutritious mix of almonds, cashews, raisins and pistachios.",
    manufacturer: "NutriMix Producers",
    address: "45 Almond Street, Maharashtra, India",
    origin: "India",
    productionDate: "2025-06-25",
    ingredients: "Almonds, Cashews, Raisins, Pistachios",
    expiry: "Best before 6 months from packaging date. Store in cool, dry place.",
    nutrition: {
      calories: "607 kcal",
      protein: "20g",
      fat: "54g",
      carbs: "22g",
      vitamins: "Vitamin E, Magnesium",
    },
  },
  {
    id: 5,
    title: "Cold Pressed Sunflower Oil (1L)",
    price: 180,
    quantity: "1L",
    rating: 4.2,
    image: `${process.env.PUBLIC_URL}/img/cold-pressed-sunflower-oil.png`,
    description: "Heart-healthy sunflower oil for daily cooking.",
    manufacturer: "SunPure Oils",
    address: "89 Oil Mill Rd, Rajasthan, India",
    origin: "India",
    productionDate: "2025-07-01",
    ingredients: "100% Cold Pressed Sunflower Oil",
    expiry: "Best before 1 year from packaging. Store in a cool, dry place.",
    nutrition: {
      calories: "884 kcal",
      protein: "0g",
      fat: "100g",
      carbs: "0g",
      vitamins: "Vitamin E, K",
    },
  },
  {
    id: 6,
    title: "Spicy Masala Powder (200g)",
    price: 89,
    quantity: "200g",
    rating: 4.0,
    image: `${process.env.PUBLIC_URL}/img/spicy-masala-powder.png`,
    description: "Add fiery flavor to your meals with this masala blend.",
    manufacturer: "SpiceWorld Pvt Ltd",
    address: "22 Spice Market, Kerala, India",
    origin: "India",
    productionDate: "2025-06-15",
    ingredients: "Red chili, Coriander, Turmeric, Black pepper, Cumin",
    expiry: "Best before 1 year from packaging. Store in airtight container.",
    nutrition: {
      calories: "300 kcal",
      protein: "10g",
      fat: "5g",
      carbs: "55g",
      vitamins: "Vitamin A, C",
    },
  },
  {
    id: 7,
    title: "Britannia Good Day Biscuits (600g)",
    price: 55,
    quantity: "600g",
    rating: 4.3,
    image: `${process.env.PUBLIC_URL}/img/britannia-good-day-biscuits.png`,
    description: "Crunchy and sweet biscuits for every tea-time.",
    manufacturer: "Britannia Industries Ltd.",
    address: "45 Biscuit Road, Karnataka, India",
    origin: "India",
    productionDate: "2025-07-03",
    ingredients: "Wheat Flour, Sugar, Edible Vegetable Oil, Milk Solids",
    expiry: "Best before 6 months from packaging date.",
    nutrition: {
      calories: "480 kcal",
      protein: "6g",
      fat: "20g",
      carbs: "68g",
      vitamins: "Calcium, Iron",
    },
  },
  {
    id: 8,
    title: "Tata Tea Gold (500g)",
    price: 210,
    originalPrice: 240,
    quantity: "500g",
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/tata-tea-gold.png`,
    description: "Strong aroma-rich tea blend for a perfect start.",
    manufacturer: "Tata Consumer Products Ltd.",
    address: "Tea Gardens, Assam, India",
    origin: "India",
    productionDate: "2025-06-20",
    ingredients: "Black Tea Leaves",
    expiry: "Best before 1 year from packaging. Store in cool dry place.",
    nutrition: {
      calories: "0 kcal",
      protein: "0g",
      fat: "0g",
      carbs: "0g",
      vitamins: "None",
    },
  },
  {
    id: 9,
    title: "Pepsi 2L Bottle",
    price: 85,
    quantity: "2L",
    rating: 3.9,
    image: `${process.env.PUBLIC_URL}/img/pepsi-2l-bottle.png`,
    description: "Chilled fizzy refreshment for every celebration.",
    manufacturer: "PepsiCo India Holdings",
    address: "10 Beverage Lane, Maharashtra, India",
    origin: "India",
    productionDate: "2025-07-05",
    ingredients: "Carbonated Water, Sugar, Caffeine, Flavorings",
    expiry: "Best before 6 months from packaging date. Refrigerate after opening.",
    nutrition: {
      calories: "150 kcal",
      protein: "0g",
      fat: "0g",
      carbs: "41g",
      vitamins: "None",
    },
  },
  {
    id: 10,
    title: "Frozen Green Peas (1kg)",
    price: 120,
    quantity: "1kg",
    rating: 4.2,
    image: `${process.env.PUBLIC_URL}/img/frozen-green-peas.png`,
    description: "Fresh-frozen green peas, ready to cook.",
    manufacturer: "Green Farm Foods",
    address: "88 Frozen Road, Punjab, India",
    origin: "India",
    productionDate: "2025-06-30",
    ingredients: "Green Peas",
    expiry: "Best before 1 year from packaging. Store in freezer.",
    nutrition: {
      calories: "81 kcal",
      protein: "5g",
      fat: "0.4g",
      carbs: "14g",
      vitamins: "Vitamin A, C, K",
    },
  },
  {
    id: 11,
    title: "Maggi 12 Pack (560g)",
    price: 115,
    originalPrice: 135,
    quantity: "560g",
    rating: 4.7,
    image: `${process.env.PUBLIC_URL}/img/maggi-12-pack.png`,
    description: "Instant noodles – everyone's favorite snack!",
    manufacturer: "Nestlé India Ltd.",
    address: "24 Noodle Street, Haryana, India",
    origin: "India",
    productionDate: "2025-06-25",
    ingredients: "Wheat Flour, Edible Vegetable Oil, Salt, Spices",
    expiry: "Best before 12 months from packaging date.",
    nutrition: {
      calories: "350 kcal",
      protein: "7g",
      fat: "14g",
      carbs: "47g",
      vitamins: "Iron, Vitamin B12",
    },
  },
];


export default function Products({ limit = productList.length, title = "All Products" }) {
  const {
    toggleWishlistItem,
    isInWishlist,
    addToCart,
    removeFromCart,
    cartItems,
  } = useAppContext();

  const [quantities, setQuantities] = useState({});
  const location = useLocation();

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Read search query from URL
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search")?.toLowerCase() || "";
  }, [location.search]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return productList
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
      )
      .slice(0, limit);
  }, [searchQuery, limit]);

  // Sync quantities with cart items
  useEffect(() => {
    const updated = {};
    cartItems.forEach((item) => {
      updated[item.id] = item.quantity;
    });
    setQuantities(updated);
  }, [cartItems]);

  // Cart handlers
  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const increaseQty = (product) => {
    const currentQty = quantities[product.id] || 0;
    const newQty = currentQty + 1;
    addToCart({ ...product, quantity: newQty });
    setQuantities((prev) => ({ ...prev, [product.id]: newQty }));
  };

  const decreaseQty = (product) => {
    const currentQty = quantities[product.id] || 0;
    if (currentQty <= 1) {
      removeFromCart(product.id);
      setQuantities((prev) => {
        const { [product.id]: _, ...rest } = prev;
        return rest;
      });
    } else {
      const newQty = currentQty - 1;
      addToCart({ ...product, quantity: newQty });
      setQuantities((prev) => ({ ...prev, [product.id]: newQty }));
    }
  };

  return (
    <section className="my-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#3E5F44]">
        {searchQuery ? `Results for "${searchQuery}"` : title}
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const quantity = quantities[product.id] || 0;

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`cursor-pointer relative rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col justify-between overflow-hidden ${
                  quantity > 0
                    ? "bg-gradient-to-t from-[#f0fff4] to-white"
                    : "bg-white"
                }`}
              >
                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlistItem(product);
                  }}
                  className={`absolute top-2 left-2 z-10 ${
                    inWishlist ? "text-red-500" : "text-gray-300"
                  } hover:text-red-600 transition-colors`}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <FaHeart size={16} />
                </button>

                {/* Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-contain mb-3 rounded"
                  loading="lazy"
                />

                {/* Title & Description */}
                <h3 className="font-bold text-sm text-[#3E5F44]">{product.title}</h3>
                <p className="text-xs text-gray-700 mt-1 line-clamp-2">{product.description}</p>

                {/* Rating & Quantity */}
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="flex items-center gap-1 text-yellow-500">
                    <FaStar size={14} />
                    <span className="text-gray-800">{product.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-[#5E936C] font-medium">{product.quantity}</span>
                </div>

                {/* Price & Cart */}
                <div className="flex justify-between items-center mt-3 z-10">
                  <div className="flex flex-col items-start">
                    <span className="text-[#5E936C] font-bold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {quantity > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQty(product);
                        }}
                        className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                        aria-label={`Decrease quantity of ${product.title}`}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-1 text-sm select-none">{quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQty(product);
                        }}
                        className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                        aria-label={`Increase quantity of ${product.title}`}
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-[#5E936C] text-white px-3 py-1 text-xs rounded hover:bg-[#3E5F44] transition"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#E8FFD7] to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
