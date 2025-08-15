import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

const ContactUs = () => {
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
        Contact Us
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700"
      >
        <p className="leading-relaxed">
          For any queries or support, please contact us:
        </p>

        <ul className="list-none space-y-2 mt-3">
          <li>
            <strong>📞 WhatsApp:</strong> +91 80727 31783
          </li>
          <li>
            <strong>📧 Email:</strong> care.ariesleo@gmail.com
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">Business Hours</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Monday – Saturday: 10:00 AM to 7:00 PM</li>
          <li>Sunday: Closed</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default ContactUs;
