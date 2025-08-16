import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

const ContactUs: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-responsive py-4 sm:py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600">
              We're here to help with any questions or concerns you may have.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-responsive py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-6">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Quick Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-rose rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Quick Contact
                  </h2>
                  <p className="text-gray-600">
                    Get in touch with us instantly
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href="https://wa.me/918072731783"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">+91 80727 31783</p>
                  </div>
                </a>

                <a
                  href="mailto:care.ariesleo@gmail.com"
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <EnvelopeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">
                      care.ariesleo@gmail.com
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Location & Map */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-mauve rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Business Hours
                  </h2>
                  <p className="text-gray-600">When we're available to help</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">
                    Monday - Saturday
                  </span>
                  <span className="text-gray-600">10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Sunday</span>
                  <span className="text-red-500 font-medium">Closed</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> For urgent matters like payment issues
                  or order problems, contact us via WhatsApp for faster
                  response.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="h-[300px] sm:h-[400px]">
            <iframe
              src="https://maps.google.com/maps?q=12.6714488,79.2864813&z=14&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aries Leo Fashion Store Location"
              className="w-full h-full rounded-2xl"
            ></iframe>
          </div>
        </motion.div>

        {/* Support Information */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-accent-rose to-accent-mauve rounded-2xl p-8 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-black text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-accent-light mb-6 max-w-2xl mx-auto">
            Our customer support team is ready to assist you with orders,
            returns, product questions, and any other inquiries you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918072731783"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border border-accent-rose text-accent-rose px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <a
              href="mailto:care.ariesleo@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-accent-rose text-accent-rose px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-accent-rose transition-colors"
            >
              <EnvelopeIcon className="w-5 h-5" />
              Send Email
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
