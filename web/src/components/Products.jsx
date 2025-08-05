import { useEffect, useMemo, useState } from 'react';
import { FaHeart, FaPlus, FaMinus, FaStar } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const productList = [
  {
    id: 1,
    title: "Fresh Apples (1kg)",
    price: 150,
    quantity: "1kg",
    rating: 4.3,
    image: "/img/fresh-apples.png",
    description: "Crisp and sweet apples, farm fresh and organically grown.",
  },
  {
    id: 2,
    title: "Amul Milk 1L Pack",
    price: 65,
    quantity: "1L",
    rating: 4.6,
    image: "/img/amul-milk.png",
    description: "Toned milk for your daily nutrition and health needs.",
  },
  {
    id: 3,
    title: "Farm Fresh Eggs (12 pcs)",
    price: 90,
    quantity: "12 pcs",
    rating: 4.4,
    image: "/img/farm-fresh-eggs.png",
    description: "High-protein fresh eggs straight from healthy farms.",
  },
  {
    id: 4,
    title: "Dry Fruits Mix (500g)",
    price: 399,
    quantity: "500g",
    rating: 4.1,
    image: "/img/dry-fruits-mix.png",
    description: "A nutritious mix of almonds, cashews, raisins and pistachios.",
  },
  {
    id: 5,
    title: "Cold Pressed Sunflower Oil (1L)",
    price: 180,
    quantity: "1L",
    rating: 4.2,
    image: "/img/cold-pressed-sunflower-oil.png",
    description: "Heart-healthy sunflower oil for daily cooking.",
  },
  {
    id: 6,
    title: "Spicy Masala Powder (200g)",
    price: 89,
    quantity: "200g",
    rating: 4.0,
    image: "/img/spicy-masala-powder.png",
    description: "Add fiery flavor to your meals with this masala blend.",
  },
  {
    id: 7,
    title: "Britannia Good Day Biscuits (600g)",
    price: 55,
    quantity: "600g",
    rating: 4.3,
    image: "/img/britannia-good-day-biscuits.png",
    description: "Crunchy and sweet biscuits for every tea-time.",
  },
  {
    id: 8,
    title: "Tata Tea Gold (500g)",
    price: 210,
    quantity: "500g",
    rating: 4.5,
    image: "/img/tata-tea-gold.png",
    description: "Strong aroma-rich tea blend for a perfect start.",
  },
  {
    id: 9,
    title: "Pepsi 2L Bottle",
    price: 85,
    quantity: "2L",
    rating: 3.9,
    image: "/img/pepsi-2l-bottle.png",
    description: "Chilled fizzy refreshment for every celebration.",
  },
  {
    id: 10,
    title: "Frozen Green Peas (1kg)",
    price: 120,
    quantity: "1kg",
    rating: 4.2,
    image: "/img/frozen-green-peas.png",
    description: "Fresh-frozen green peas, ready to cook.",
  },
  {
    id: 11,
    title: "Maggi 12 Pack (560g)",
    price: 115,
    quantity: "560g",
    rating: 4.7,
    image: "/img/maggi-12-pack.png",
    description: "Instant noodles – everyone's favorite snack!",
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

  // Parse search only once per location change
  const searchQuery = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("search")?.toLowerCase() || "";
  }, [location.search]);

  // Filtered products with memoization
  const filteredProducts = useMemo(() => {
    return productList
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
      )
      .slice(0, limit);
  }, [searchQuery, limit]);

  // Sync quantities with cart
  useEffect(() => {
    const updated = {};
    cartItems.forEach((item) => {
      updated[item.id] = item.quantity;
    });
    setQuantities(updated);
  }, [cartItems]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const increaseQty = (product) => {
    addToCart(product);
    setQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 1) + 1,
    }));
  };

  const decreaseQty = (product) => {
    const currentQty = quantities[product.id] || 1;
    if (currentQty <= 1) {
      removeFromCart(product.id);
      setQuantities((prev) => {
        const { [product.id]: _, ...rest } = prev;
        return rest;
      });
    } else {
      addToCart({ ...product, quantity: currentQty - 1 });
      setQuantities((prev) => ({
        ...prev,
        [product.id]: currentQty - 1,
      }));
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
                className={`relative rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col justify-between overflow-hidden ${
                  quantity > 0
                    ? "bg-gradient-to-t from-[#f0fff4] to-white"
                    : "bg-white"
                }`}
              >
                {/* Wishlist Icon */}
                <button
                  onClick={() => toggleWishlistItem(product)}
                  className={`absolute top-2 left-2 z-10 ${
                    inWishlist ? "text-red-500" : "text-gray-300"
                  } hover:text-red-600 transition-colors`}
                >
                  <FaHeart size={16} />
                </button>

                {/* Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-contain mb-3 rounded"
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
                  <span className="text-[#5E936C] font-bold">₹{product.price}</span>

                  {quantity > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQty(product)}
                        className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-1 text-sm">{quantity}</span>
                      <button
                        onClick={() => increaseQty(product)}
                        className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
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
    </section>
  );
}
