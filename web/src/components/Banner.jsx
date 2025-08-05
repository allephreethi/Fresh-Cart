import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const banners = [
  {
    title: 'Fresh Groceries Delivered Fast!',
    description:
      'Get all your daily needs and essentials with lightning-fast delivery and best prices.',
    image: 'https://cdn-icons-png.flaticon.com/512/4052/4052984.png',
  },
  {
    title: 'Organic Veggies at Your Doorstep!',
    description:
      'Pick from our hand-selected range of farm-fresh organic vegetables and fruits.',
    image: 'https://cdn-icons-png.flaticon.com/512/7653/7653532.png',
  },
];

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const current = banners[index];

  // Typing effect
  useEffect(() => {
    if (charIndex < current.title.length) {
      const typingTimeout = setTimeout(() => {
        setTypedText((prev) => prev + current.title[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(typingTimeout);
    }
  }, [charIndex, current.title]);

  // Slide after typing
  useEffect(() => {
    if (charIndex === current.title.length) {
      const slideTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % banners.length);
        setCharIndex(0);
        setTypedText('');
      }, 3000);
      return () => clearTimeout(slideTimeout);
    }
  }, [charIndex, current.title.length]);

  return (
    <section className="relative rounded-xl overflow-hidden p-4 md:p-6 shadow-lg w-full">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(90deg, #3E5F44, #5E936C, #93DA97, #E8FFD7)',
          opacity: 0.95,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4"
        >
          {/* Text */}
          <div className="text-white w-full sm:w-1/2 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold break-words mb-2">
              {typedText}
              <span className="border-r-2 border-white animate-pulse ml-1" />
            </h2>
            <p className="text-sm sm:text-base mb-4 px-2 sm:px-0">{current.description}</p>
            <Link
              to="/products"
              className="inline-block bg-white text-green-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition text-sm"
            >
              Shop Now
            </Link>
          </div>

          {/* Image */}
          <div className="w-full sm:w-auto flex justify-center">
            <img
              src={current.image}
              alt="Banner"
              className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain drop-shadow-md"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
