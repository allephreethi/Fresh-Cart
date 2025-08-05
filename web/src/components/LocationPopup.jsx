import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';

export default function LocationPopup() {
  const { locationData, closeLocationPopup } = useAppContext();
  const [visible, setVisible] = useState(true);

  const { address, city } = locationData || {};
  const loading = !address && !city;
  const error = !navigator.geolocation;

  useEffect(() => {
    if (address && !loading && !error) {
      const timer = setTimeout(() => {
        setVisible(false);
        closeLocationPopup();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [address, loading, error, closeLocationPopup]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md p-4 w-80 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white">Your Location</h3>
        <button onClick={() => {
          setVisible(false);
          closeLocationPopup();
        }}>
          <X size={18} className="text-gray-500 hover:text-red-500" />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">📍 Detecting location...</p>
      ) : error ? (
        <p className="text-sm text-red-500">⚠️ Geolocation not supported.</p>
      ) : (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>📍 <strong>City:</strong> {city}</p>
          <p className="mt-1"><strong>Address:</strong></p>
          <p>{address}</p>
        </div>
      )}
    </div>
  );
}
