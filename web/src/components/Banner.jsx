import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Leaf } from 'tabler-icons-react';

const banners = [
  {
    title: 'Fresh Groceries Delivered Fast!',
    description:
      'Get all your daily needs and essentials with lightning-fast delivery and best prices.',
    icon: <ShoppingCart size={160} strokeWidth={1.5} color="#5E936C" />,
  },
  {
    title: 'Organic Veggies at Your Doorstep!',
    description:
      'Pick from our hand-selected range of farm-fresh organic vegetables and fruits.',
    icon: <Leaf size={160} strokeWidth={1.5} color="#5E936C" />,
  },
];

const MotionLink = motion(Link);

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const current = banners[index];

  useEffect(() => {
    if (charIndex < current.title.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + current.title[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 45);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, current.title]);

  useEffect(() => {
    if (charIndex === current.title.length) {
      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % banners.length);
        setCharIndex(0);
        setTypedText('');
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, current.title.length]);

  return (
    <section
      className="relative rounded-xl overflow-hidden p-6 shadow-xl w-full select-none"
      style={{
        background: `linear-gradient(90deg, #5E936C, #93DA97, #E8FFD7)`,
      }}
    >
      {/* Animated blurred blobs */}
      <motion.div
        className="absolute top-8 left-6 w-36 h-36 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: '#5E936C' }}
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-48 h-48 rounded-full opacity-40 blur-2xl"
        style={{ backgroundColor: '#93DA97' }}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-6"
        >
          {/* Text container */}
          <div
            className="w-full sm:w-1/2 text-center sm:text-left drop-shadow-md"
            style={{ color: '#E8FFD7' }}
          >
            <h2
              className="text-3xl font-extrabold mb-3 leading-tight"
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
            >
              {typedText}
              <span
                className="border-r-2 inline-block ml-1"
                style={{
                  borderColor: '#E8FFD7',
                  animation:
                    charIndex < current.title.length
                      ? 'blink 1s steps(1) infinite'
                      : 'none',
                }}
              />
            </h2>
            <motion.p
              key={index + '-desc'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg font-medium tracking-wide mb-5"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)', color: '#E8FFD7' }}
            >
              {current.description}
            </motion.p>

            <MotionLink
              to="/products"
              initial={{ scale: 1 }}
              animate={
                charIndex === current.title.length
                  ? { scale: [1, 1.1, 1] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-green-200 transition"
              style={{
                backgroundColor: 'white',
                color: '#5E936C',
              }}
            >
              Shop Now
            </MotionLink>
          </div>

          {/* Icon container with glow */}
          <motion.div
            whileHover={{ rotateY: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="w-full sm:w-auto flex justify-center relative"
          >
            <div
              className="rounded-full p-6 shadow-lg drop-shadow-xl backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              {/* Icon with soft glow */}
              <div
                style={{
                  filter:
                    'drop-shadow(0 0 10px #93DA97AA) drop-shadow(0 0 20px #5E936CAA)',
                }}
              >
                {current.icon}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex justify-center gap-3 mt-6 relative z-10">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
              i === index ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => {
              setIndex(i);
              setCharIndex(0);
              setTypedText('');
            }}
          />
        ))}
      </div>

      {/* Cursor blink keyframes */}
      <style>{`
        @keyframes blink {
          0%, 50%, 100% { border-color: #E8FFD7; }
          25%, 75% { border-color: transparent; }
        }
      `}</style>
    </section>
  );
}
