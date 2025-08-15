import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

const TermsAndConditions = () => {
  useScrollToTop();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2"
      >
        Terms & Conditions
      </motion.h1>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Introduction
        </h2>
        <p className="leading-relaxed">
          Welcome to Aries Leo. By placing an order with us, you agree to be
          bound by the following terms and conditions. Please read them
          carefully before making a purchase.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Products & Descriptions
        </h2>
        <p className="leading-relaxed">
          We take care to ensure that product descriptions, prices, and
          availability are accurate. However, slight variations in color or
          measurements may occur due to handmade processes or screen
          differences.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Orders & Payments
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>All orders must be paid in full before shipping.</li>
          <li>Orders will be processed only after payment confirmation.</li>
          <li>
            Once an order is placed, it cannot be cancelled under any
            circumstances.
          </li>
          <li>
            We reserve the right to cancel any order due to stock unavailability
            or payment issues.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Returns & Exchanges
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>No Return Policy: Products once sold cannot be returned.</li>
          <li>
            Exchange Policy: Items can be exchanged only if damaged during
            delivery. An unedited opening video is required as proof. Without
            the video, exchanges will not be accepted.
          </li>
          <li>
            Exchange requests must be made within 24 hours of receiving the
            order.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Care Instructions
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>All pants are 100% pure cotton.</li>
          <li>Except Kalamkari, all pants are machine washable.</li>
          <li>
            Kalamkari fabric should be washed with mild soap, no machine wash,
            and dried in shade.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Liability
        </h2>
        <p className="leading-relaxed">
          We are not responsible for delays caused by courier companies or
          unforeseen circumstances.
        </p>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
