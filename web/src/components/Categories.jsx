import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  Boxes, ShoppingCart, Apple, Milk, Package, Egg,
  Flame, Nut, Snowflake, Cookie, CupSoda, Popcorn, Coffee
} from 'lucide-react';

const categories = [
  { name: 'All Products', icon: Boxes, slug: 'all-products' },
  { name: 'Groceries', icon: ShoppingCart, slug: 'groceries' },
  { name: 'Fruits', icon: Apple, slug: 'fruits' },
  { name: 'Dairy', icon: Milk, slug: 'dairy' },
  { name: 'Packaged Food', icon: Package, slug: 'packaged-food' },
  { name: 'Eggs', icon: Egg, slug: 'eggs' },
  { name: 'Masalas', icon: Flame, slug: 'masalas' },
  { name: 'Dry Fruits', icon: Nut, slug: 'dry-fruits' },
  { name: 'Frozen Food', icon: Snowflake, slug: 'frozen-food' },
  { name: 'Biscuits', icon: Cookie, slug: 'biscuits' },
  { name: 'Cold Drinks', icon: CupSoda, slug: 'cold-drinks' },
  { name: 'Snacks', icon: Popcorn, slug: 'snacks' },
  { name: 'Tea/Coffee', icon: Coffee, slug: 'tea-coffee' },
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
        const cardWidth = 80 + 12; // 80px card + 12px margin approximation
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
    if (
      selectedIndex < startIndex ||
      selectedIndex >= startIndex + cardsPerPage
    ) {
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
            {visibleCategories.map(({ name, icon: Icon, slug }, index) => {
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
                  role="button"
                  tabIndex={0}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-lg text-center text-xs w-20 shrink-0 cursor-pointer transition 
                    ${isSelected
                      ? 'bg-green-100 border border-green-500 scale-105 ring-2 ring-green-400 shadow-md'
                      : 'bg-white hover:bg-green-50 hover:shadow-lg hover:scale-105'
                    }`}
                >
                  <div className="bg-green-100 p-1.5 rounded-full mb-1">
                    <Icon size={18} className="text-green-700" />
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
