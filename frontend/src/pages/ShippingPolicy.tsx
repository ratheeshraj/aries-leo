import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

const ShippingPolicy = () => {
  useScrollToTop();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2"
      >
        Shipping Policy
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700"
      >
        <h2 className="text-xl font-semibold mt-6 mb-3">Processing Time</h2>
        <p>Orders are shipped within 24 hours of confirmation.</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Delivery Timeframes</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Within Tamil Nadu: 2–3 days</li>
          <li>Other States in India: 3–5 days</li>
          <li>International Shipping: 15 working days</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">Tracking</h2>
        <p>Tracking details will be shared once the order is dispatched.</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Delays</h2>
        <p>
          We are not responsible for delays due to customs, courier disruptions,
          or unforeseen events.
        </p>
      </motion.div>
    </div>
  );
};

export default ShippingPolicy;
