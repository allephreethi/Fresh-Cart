import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  LayoutGrid, ShoppingCart, Apple, Milk, BoxSelect, Egg,
  CookingPot, Nut, Snowflake, Cookie, GlassWater, Popcorn, Coffee
} from 'lucide-react'; // ✅ valid icons

const categories = [
  { name: 'All Products', icon: LayoutGrid, slug: 'all-products', color: 'text-gray-700' },
  { name: 'Groceries', icon: ShoppingCart, slug: 'groceries', color: 'text-green-700' },
  { name: 'Fruits', icon: Apple, slug: 'fruits', color: 'text-red-600' },
  { name: 'Dairy', icon: Milk, slug: 'dairy', color: 'text-yellow-500' },
  { name: 'Packaged Food', icon: BoxSelect, slug: 'packaged-food', color: 'text-orange-500' },
  { name: 'Eggs', icon: Egg, slug: 'eggs', color: 'text-amber-500' },
  { name: 'Masalas', icon: CookingPot, slug: 'masalas', color: 'text-rose-600' },
  { name: 'Dry Fruits', icon: Nut, slug: 'dry-fruits', color: 'text-amber-700' },
  { name: 'Frozen Food', icon: Snowflake, slug: 'frozen-food', color: 'text-blue-500' },
  { name: 'Biscuits', icon: Cookie, slug: 'biscuits', color: 'text-yellow-600' },
  { name: 'Cold Drinks', icon: GlassWater, slug: 'cold-drinks', color: 'text-cyan-600' },
  { name: 'Snacks', icon: Popcorn, slug: 'snacks', color: 'text-orange-400' },
  { name: 'Tea/Coffee', icon: Coffee, slug: 'tea-coffee', color: 'text-amber-800' },
];

export default function CategoriesSection({ onCategorySelect }) {
  const containerRef = useRef(null);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState('all-products');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 80 + 12;
        const visibleCount = Math.floor(containerWidth / cardWidth);
        setCardsPerPage(visibleCount);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategoryClick = (slug) => {
    setSelectedSlug(slug);
    onCategorySelect?.(slug);
    navigate(`/products/${slug}`);

    const selectedIndex = categories.findIndex((c) => c.slug === slug);
    if (selectedIndex < startIndex || selectedIndex >= startIndex + cardsPerPage) {
      setStartIndex(Math.max(0, selectedIndex - Math.floor(cardsPerPage / 2)));
    }
  };

  const scroll = (dir) => {
    const newIndex =
      dir === 'left'
        ? Math.max(startIndex - cardsPerPage, 0)
        : Math.min(startIndex + cardsPerPage, categories.length - cardsPerPage);
    setStartIndex(newIndex);
  };

  const visibleCategories = categories.slice(startIndex, startIndex + cardsPerPage);

  return (
    <section className="my-4 px-4">
      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow p-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
          Shop by Category
        </h2>

        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="p-2 bg-white/60 backdrop-blur-md rounded-full shadow-md hover:bg-white mr-2 disabled:opacity-30"
            disabled={startIndex === 0}
          >
            <FaChevronLeft />
          </button>

          {/* Category Cards */}
          <div
            ref={containerRef}
            className="flex gap-2 justify-center w-full max-w-6xl mx-auto overflow-hidden"
          >
            {visibleCategories.map(({ name, icon: Icon, slug, color }, index) => {
              const isSelected = slug === selectedSlug;
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(slug)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(slug)}
                  role="button"
                  tabIndex={0}
                  aria-label={name}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-lg text-center text-xs w-20 shrink-0 cursor-pointer transition 
                    ${isSelected
                      ? 'bg-green-100 border border-green-500 scale-105 ring-2 ring-green-400 shadow-md'
                      : 'bg-white hover:bg-green-50 hover:shadow-lg hover:scale-105'
                    }`}
                >
                  <div className="p-1.5 rounded-full mb-1 bg-white shadow-inner">
                    <Icon size={18} className={color} />
                  </div>
                  <p className="text-gray-800 font-medium">{name}</p>

                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                    {name}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="p-2 bg-white/60 backdrop-blur-md rounded-full shadow-md hover:bg-white ml-2 disabled:opacity-30"
            disabled={startIndex + cardsPerPage >= categories.length}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
