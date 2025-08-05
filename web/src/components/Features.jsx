import { Truck, ShieldCheck, RotateCcw, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Free Delivery",
    description: "On all orders above ₹499",
    icon: <Truck className="w-6 h-6 text-green-600" />,
  },
  {
    title: "Secure Payments",
    description: "100% payment protection",
    icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
  },
  {
    title: "Easy Returns",
    description: "7-day hassle-free return",
    icon: <RotateCcw className="w-6 h-6 text-green-600" />,
  },
  {
    title: "24/7 Support",
    description: "We're here to help anytime",
    icon: <PhoneCall className="w-6 h-6 text-green-600" />,
  },
];

export default function Features() {
  return (
    <section className="-mt-16 z-10 relative pt-12 pb-14 bg-gradient-to-b from-white to-gray-50 rounded-t-3xl shadow-md">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-800">Why Shop with Us?</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
          Experience a smarter, safer, and faster way to shop — just for you.
        </p>
        <div className="mt-3 w-16 h-1 mx-auto bg-green-500 rounded-full" />
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="w-full max-w-[180px] sm:max-w-[200px] bg-white p-5 rounded-xl border border-gray-200 shadow group hover:border-green-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="mb-3 p-3 rounded-full bg-green-100 flex items-center justify-center transition-transform group-hover:scale-110">
              {feature.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
