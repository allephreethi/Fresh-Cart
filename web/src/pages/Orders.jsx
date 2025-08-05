import { motion } from 'framer-motion';

const dummyOrders = [
  {
    id: 'ORD123456',
    date: '2025-08-01',
    status: 'Delivered',
    total: 1250,
    items: ['Fresh Apples', 'Amul Milk', 'Bread'],
  },
  {
    id: 'ORD123457',
    date: '2025-07-28',
    status: 'Processing',
    total: 890,
    items: ['Maggie', 'Eggs', 'Chips'],
  },
];

export default function Orders() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#5E936C] mb-2">
        My Orders
      </h1>
      <p className="mb-6 text-zinc-600 text-sm sm:text-base">
        Here is a list of all your previous and current orders.
      </p>

      <div className="space-y-5">
        {dummyOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-[#93DA97] shadow-md hover:shadow-lg transition p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <div>
                <p className="font-semibold text-zinc-800 text-sm sm:text-base">
                  Order ID: <span className="text-[#5E936C]">{order.id}</span>
                </p>
                <p className="text-xs sm:text-sm text-zinc-500">Placed on: {order.date}</p>
              </div>

              <div>
                <span
                  className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-[#E8FFD7] text-[#5E936C]'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="text-sm sm:text-base text-zinc-700">
              <p>
                <strong>Total:</strong> ₹{order.total}
              </p>
              <p className="mt-1">
                <strong>Items:</strong> {order.items.join(', ')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
