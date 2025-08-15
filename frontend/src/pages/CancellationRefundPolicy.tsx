import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

const CancellationRefundPolicy = () => {
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
        Cancellation & Refund Policy
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700"
      >
        <h2 className="text-xl font-semibold mt-6 mb-3">Order Cancellation</h2>
        <p className="leading-relaxed">
          Once an order is placed, it cannot be cancelled under any
          circumstances.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Refund Policy</h2>
        <p className="leading-relaxed">
          We do not offer refunds for orders once placed, except in cases of
          defective/damaged items where exchange is not possible.
        </p>
        <p className="leading-relaxed">
          Refunds, if approved, will be processed within 7 business days to the
          original payment method.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Exchange Conditions</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Damaged items are eligible for exchange only with proof via an
            unedited opening video sent within 24 hours of delivery.
          </li>
          <li>Without the video proof, exchanges will not be accepted.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default CancellationRefundPolicy;
