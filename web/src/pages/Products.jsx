import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaPlus, FaMinus } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import CategoriesSection from '../components/Categories';

const allProducts = [
  {
    id: 1,
    title: 'Fresh Apples (1kg)',
    price: 150,
    quantity: '1kg',
    rating: 4.3,
    image: '/img/fresh-apples.png',
    description: 'Crisp and sweet apples, farm fresh and organically grown.',
    tags: ['New', 'Organic'],
    category: 'fruits',
  },
  {
    id: 2,
    title: 'Amul Milk 1L Pack',
    price: 65,
    quantity: '1L',
    rating: 4.6,
    image: '/img/amul-milk-1l-pack.png',
    description: 'Toned milk for your daily nutrition and health needs.',
    tags: ['Hot'],
    category: 'dairy',
  },
  {
    id: 3,
    title: 'Aashirvaad Atta 5kg',
    price: 240,
    quantity: '5kg',
    rating: 4.5,
    image: '/img/aashirvaad-atta-5kg.png',
    description: 'Whole wheat flour for soft rotis and parathas.',
    tags: ['New'],
    category: 'packaged-food',
  },
  {
    id: 4,
    title: 'Cadbury Dairy Milk Chocolate',
    price: 90,
    quantity: '150g',
    rating: 4.7,
    image: '/img/cadbury-dairy-milk-chocolate.png',
    description: 'Rich and creamy chocolate to sweeten your day.',
    tags: ['Hot'],
    category: 'packaged-food',
  },
  {
    id: 5,
    title: 'Country Eggs (6pcs)',
    price: 60,
    quantity: '6 pcs',
    rating: 4.4,
    image: '/img/country-eggs-6pcs.png',
    description: 'Farm-fresh country eggs full of protein.',
    tags: ['Organic'],
    category: 'eggs',
  },
  {
    id: 6,
    title: 'Everest Chicken Masala 100g',
    price: 55,
    quantity: '100g',
    rating: 4.3,
    image: '/img/everest-chicken-masala-100g.png',
    description: 'Flavorful masala for tasty chicken dishes.',
    tags: ['Spicy'],
    category: 'masalas',
  },
  {
    id: 7,
    title: 'California Almonds 500g',
    price: 399,
    quantity: '500g',
    rating: 4.8,
    image: '/img/california-almonds-500g.png',
    description: 'Premium quality almonds for daily health.',
    tags: ['Hot', 'Organic'],
    category: 'dry-fruits',
  },
  {
    id: 8,
    title: 'Yummiez Chicken Nuggets 400g',
    price: 210,
    quantity: '400g',
    rating: 4.2,
    image: '/img/yummiez-chicken-nuggets-400g.png',
    description: 'Frozen and ready-to-fry crispy chicken nuggets.',
    tags: ['Hot'],
    category: 'frozen-food',
  },
  {
    id: 9,
    title: 'Parle-G Biscuits (800g)',
    price: 55,
    quantity: '800g',
    rating: 4.6,
    image: '/img/parle-g-biscuits-800g.png',
    description: 'Classic biscuits for tea-time munching.',
    tags: ['Classic'],
    category: 'biscuits',
  },
  {
    id: 10,
    title: 'Pepsi 1.25L',
    price: 45,
    quantity: '1.25L',
    rating: 4.1,
    image: '/img/pepsi-1-25l.png',
    description: 'Chilled carbonated beverage for refreshment.',
    tags: ['Chilled'],
    category: 'cold-drinks',
  },
  {
    id: 11,
    title: 'Lays Classic Salted Chips',
    price: 20,
    quantity: '52g',
    rating: 4.4,
    image: '/img/lays-classic-salted-chips.png',
    description: 'Crispy potato chips with classic salted flavor.',
    tags: ['Hot'],
    category: 'snacks',
  },
  {
    id: 12,
    title: 'Tata Tea Gold 500g',
    price: 250,
    quantity: '500g',
    rating: 4.5,
    image: '/img/tata-tea-gold.png',
    description: 'Strong and flavorful tea blend.',
    tags: ['Refreshing'],
    category: 'tea-coffee',
  },
  {
    id: 13,
    title: 'Bru Instant Coffee 100g',
    price: 130,
    quantity: '100g',
    rating: 4.6,
    image: '/img/bru-instant-coffee-100g.png',
    description: 'Instant coffee for a quick caffeine fix.',
    tags: ['Hot'],
    category: 'tea-coffee',
  },
  {
    id: 14,
    title: 'Frozen Green Peas 1kg',
    price: 95,
    quantity: '1kg',
    rating: 4.2,
    image: '/img/frozen-green-peas.png',
    description: 'Hygienically packed frozen green peas.',
    tags: ['Frozen'],
    category: 'frozen-food',
  },
  {
    id: 15,
    title: 'Amul Butter 500g',
    price: 280,
    quantity: '500g',
    rating: 4.9,
    image: '/img/amul-butter-500g.png',
    description: 'Rich, creamy butter for spreading and cooking.',
    tags: ['Dairy'],
    category: 'dairy',
  },
  {
    id: 16,
    title: 'Bananas (1 Dozen)',
    price: 55,
    quantity: '12 pcs',
    rating: 4.4,
    image: '/img/bananas-1-dozen.png',
    description: 'Naturally ripened bananas full of nutrients.',
    tags: ['Fresh'],
    category: 'fruits',
  },
  {
    id: 17,
    title: 'Kissan Mixed Fruit Jam 500g',
    price: 125,
    quantity: '500g',
    rating: 4.3,
    image: '/img/kissan-mixed-fruit-jam-500g.png',
    description: 'Sweet and tangy fruit jam for your toast.',
    tags: ['Kids'],
    category: 'packaged-food',
  },
  {
    id: 18,
    title: 'Haldiram Bhujia 200g',
    price: 60,
    quantity: '200g',
    rating: 4.6,
    image: '/img/haldiram-bhujia-200g.png',
    description: 'Crispy spicy bhujia snack for every mood.',
    tags: ['Spicy'],
    category: 'snacks',
  },
  {
    id: 19,
    title: 'Britannia Good Day Cookies',
    price: 35,
    quantity: '250g',
    rating: 4.5,
    image: '/img/britannia-good-day-cookies.png',
    description: 'Crunchy and buttery cookies with cashews.',
    tags: ['Hot'],
    category: 'biscuits',
  },
  {
    id: 20,
    title: 'Tata Salt 1kg',
    price: 22,
    quantity: '1kg',
    rating: 4.7,
    image: '/img/tata-salt-1kg.png',
    description: 'Iodized salt for daily cooking needs.',
    tags: ['Essential'],
    category: 'groceries',
  },
  {
    id: 21,
    title: 'Organic Cashews 250g',
    price: 210,
    quantity: '250g',
    rating: 4.5,
    image: '/img/organic-cashews-250g.png',
    description: 'Rich, creamy cashews with organic certification.',
    tags: ['Organic'],
    category: 'dry-fruits',
  },
  {
    id: 23,
    title: 'Fortune Sunlite Refined Sunflower Oil (1L)',
    price: 130,
    quantity: '1L',
    rating: 4.4,
    image: '/img/fortune-sunlite-refined-sunflower-oil-1l.png',
    description: 'Healthy refined sunflower oil for everyday cooking.',
    tags: ['Popular', 'Value Pack'],
    category: 'groceries',
  },
  {
    id: 24,
    title: 'India Gate Basmati Rice (5kg)',
    price: 500,
    quantity: '5kg',
    rating: 4.6,
    image: '/img/india-gate-basmati-rice-5kg.png',
    description: 'Premium aged basmati rice for rich aroma and taste.',
    tags: ['Premium', 'Best Seller'],
    category: 'groceries',
  },
];

const tagList = ['New', 'Hot', 'Organic'];

export default function Products() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQueryFromURL = searchParams.get('search')?.toLowerCase() || '';
  const categoryFromURL = searchParams.get('category') || 'all-products';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [priceRange, setPriceRange] = useState(500);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [searchQueryState, setSearchQueryState] = useState(searchQueryFromURL);

  const {
    toggleWishlistItem,
    isInWishlist,
    addToCart,
    updateQuantity,
    cartItems,
  } = useAppContext();

  useEffect(() => {
    setSelectedCategory(categoryFromURL);
    setPriceRange(500);
    setSelectedTags([]);
    setSortOption('');
    setSearchQueryState(searchQueryFromURL);
  }, [location.pathname, location.search]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredProducts = allProducts
    .filter((p) => {
      const matchesCategory =
        selectedCategory === 'all-products' || p.category === selectedCategory;
      const matchesPrice = p.price <= priceRange;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => p.tags.includes(tag));
      const matchesSearch =
        !searchQueryState ||
        p.title.toLowerCase().includes(searchQueryState) ||
        p.description.toLowerCase().includes(searchQueryState);
      return matchesCategory && matchesPrice && matchesTags && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="p-4">
      <CategoriesSection onCategorySelect={(slug) => setSelectedCategory(slug)} />

      {/* Filters */}
      <motion.div
        className="bg-white shadow rounded-lg p-3 mb-6 text-sm grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium text-xs">Max Price</label>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="accent-green-600 h-1"
          />
          <span className="text-green-700 font-semibold text-xs">
            ₹{priceRange}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium text-xs">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded-full border text-xs transition ${
                  selectedTags.includes(tag)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-green-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium text-xs">Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const isWished = isInWishlist(product.id);
          const cartItem = cartItems.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative rounded-xl shadow hover:shadow-md transition-all p-3 flex flex-col justify-between overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleWishlistItem(product)}
                className={`absolute top-2 left-2 z-10 ${
                  isWished ? 'text-red-500' : 'text-gray-300'
                } hover:text-red-600 transition-colors`}
              >
                <FaHeart size={14} />
              </button>

              <img
                src={product.image}
                alt={product.title}
                className="w-full h-36 object-contain mb-2 rounded"
              />

              <h3 className="font-semibold text-xs text-[#3E5F44]">
                {product.title}
              </h3>
              <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-800">{product.rating.toFixed(1)} rating</span>
                <span className="text-[#5E936C] font-medium">{product.quantity}</span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-green-800 font-bold text-sm">
                  ₹{product.price}
                </span>

                {quantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="px-1 text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#5E936C] text-white px-3 py-1 text-xs rounded hover:bg-[#3E5F44] transition"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
