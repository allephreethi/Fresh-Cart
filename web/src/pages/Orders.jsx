// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Loader } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function Orders() {
  const { user } = useAppContext(); // user.id should exist
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setOrders([]); // Clear orders if no user
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      setOrders([]); // Clear previous orders before fetching

      try {
        console.log("Fetching orders for user:", user.id);
        const response = await axios.get(`${API_URL}/orders/my/${user.id}`);

        if (Array.isArray(response.data)) {
          // Ensure each order has proper structure
          const sanitizedOrders = response.data.map(order => ({
            ...order,
            items: Array.isArray(order.items) ? order.items : [],
            total: order.total ?? 0,
            discountAmount: order.discountAmount ?? 0,
            status: order.status || "Processing", // use DB status if available
          }));
          setOrders(sanitizedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        <Loader className="animate-spin mr-2" /> Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-gray-500 text-center mt-10">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.map(order => (
        <div key={order.id} className="mb-6 border rounded-lg shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium">Order ID:</span> {order.id} <br />
              <span className="font-medium">Placed:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
            </div>
            <div className={`px-2 py-1 rounded ${
              order.status === "Cancelled" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {order.status}
            </div>
          </div>

          <div className="mt-4">
            {order.items.length > 0 ? (
              <table className="w-full text-left border-t border-b">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Product</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.productId || Math.random()} className="border-b">
                      <td className="p-2">{item.title || "Unnamed Product"}</td>
                      <td className="p-2">{item.quantity || 0}</td>
                      <td className="p-2">₹{(item.price ?? 0).toFixed(2)}</td>
                      <td className="p-2">₹{((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-400 mt-2">No items found in this order.</div>
            )}
          </div>

          <div className="flex justify-end mt-4 font-semibold">
            Total Paid: ₹{(order.total ?? 0).toFixed(2)}
            {order.discountAmount > 0 && (
              <span className="ml-2 text-sm text-green-600">(Discount: ₹{order.discountAmount.toFixed(2)})</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
