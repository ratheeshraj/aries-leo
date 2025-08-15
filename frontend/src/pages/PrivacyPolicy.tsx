import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

const PrivacyPolicy = () => {
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
        Privacy Policy
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700"
      >
        <h2 className="text-xl font-semibold mt-6 mb-3">
          Information We Collect
        </h2>
        <p className="leading-relaxed">
          We collect personal information such as your name, address, email, and
          phone number to process orders and provide customer support.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Use of Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To process and deliver your orders.</li>
          <li>To communicate order updates and promotions (if opted in).</li>
          <li>To improve our services.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">Data Protection</h2>
        <p className="leading-relaxed">
          We do not sell or share your personal information with third parties,
          except as required to deliver your orders (e.g., courier services) or
          by law.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Payment Security</h2>
        <p className="leading-relaxed">
          We use secure payment gateways. Your financial information is not
          stored on our servers.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Cookies</h2>
        <p className="leading-relaxed">
          Our website may use cookies to enhance your shopping experience.
        </p>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
