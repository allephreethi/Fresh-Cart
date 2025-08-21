import { useAppContext } from '../context/AppContext';
import { FaTimes, FaTrash } from 'react-icons/fa';

export default function WishlistPanel() {
  const {
    wishlistOpen,
    toggleWishlist,
    wishlistItems,
    removeFromWishlist,
  } = useAppContext();

  return (
    <div
      className={`fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] z-30 transform transition-transform duration-300 shadow-lg border-l bg-white ${
        wishlistOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full bg-gradient-to-b from-[#93DA97] via-white to-[#E8FFD7]">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 bg-white shadow">
          <h2 className="text-lg font-semibold text-gray-700">Your Wishlist</h2>
          <button
            onClick={() => toggleWishlist(false)}
            className="text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Close wishlist panel"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4">
            Your wishlist is empty.
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistItems.map((item) => (
              <li
                key={item.productId} // use productId as unique key
                className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-2 hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-contain rounded"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-green-700 font-semibold">
                    ₹{item.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.productId)} // ✅ correct param
                  className="text-gray-400 hover:text-red-500 transition"
                  aria-label="Remove from wishlist"
                >
                  <FaTrash size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
