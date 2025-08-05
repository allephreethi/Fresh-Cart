import { ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function FloatingCartButton() {
  const { toggleCart, cartItems, cartOpen } = useAppContext(); // 👈 added cartOpen

  // ❌ Don't render if the cart panel is open
  if (cartOpen) return null;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const buttonClasses = `
    fixed bottom-24 right-6 z-50
    bg-gradient-to-r from-green-500 via-lime-500 to-green-700
    text-white rounded-full
    shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95
    transition-all duration-300 ease-in-out
    flex flex-col items-center justify-center
    ${itemCount > 0 ? 'px-4 py-3 min-w-12' : 'p-4 w-12 h-12'}
  `;

  return (
    <button
      onClick={() => toggleCart(true)}
      className={buttonClasses}
      aria-label={itemCount > 0 ? `${itemCount} item(s) in cart` : 'Open cart'}
    >
      <ShoppingCart
        size={24}
        className={`transition-transform duration-200 ${itemCount > 0 ? 'mb-1' : ''}`}
      />
      {itemCount > 0 && (
        <span className="text-xs font-semibold leading-tight transition-opacity duration-200">
          {itemCount === 1 ? '1 item' : `${itemCount} items`}
        </span>
      )}
    </button>
  );
}
