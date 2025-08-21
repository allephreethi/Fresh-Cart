import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { X } from "lucide-react";

export default function LocationPopup() {
  const { closeLocationPopup } = useAppContext();
  const [visible, setVisible] = useState(true);
  const [location, setLocation] = useState({ city: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use OpenStreetMap Reverse Geocoding API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          let city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb ||
            data.address.state ||
            "Unknown";

          let address = data.display_name || "Address not found";

          setLocation({ city, address });
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(true);
        setLoading(false);
      }
    );
  }, []);

  // Auto-close popup after 4s when location is available
  useEffect(() => {
    if (!loading && !error && (location.city || location.address)) {
      const timer = setTimeout(() => {
        setVisible(false);
        closeLocationPopup();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, location, closeLocationPopup]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md p-4 w-80 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Your Location
        </h3>
        <button
          onClick={() => {
            setVisible(false);
            closeLocationPopup();
          }}
        >
          <X size={18} className="text-gray-500 hover:text-red-500" />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          📍 Detecting location...
        </p>
      ) : error ? (
        <p className="text-sm text-red-500">
          ⚠️ Geolocation not supported or permission denied.
        </p>
      ) : (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>
            📍 <strong>City:</strong> {location.city}
          </p>
          <p className="mt-1">
            <strong>Address:</strong>
          </p>
          <p>{location.address}</p>
        </div>
      )}
    </div>
  );
}
