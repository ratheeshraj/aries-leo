import React, { useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../ui/Modal";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ isOpen, onClose }) => {
  const [selectedUnit, setSelectedUnit] = useState<"inches" | "cm">("inches");

  const sizeData = {
    inches: [
      { size: "XS", waist: "24-27", hips: "37", length: "37" },
      { size: "S", waist: "27-31", hips: "39", length: "37" },
      { size: "M", waist: "29-33", hips: "41", length: "37" },
      { size: "L", waist: "31-35", hips: "43", length: "38" },
      { size: "XL", waist: "34-38", hips: "46", length: "38" },
      { size: "2XL", waist: "37-41", hips: "49", length: "39" },
      { size: "3XL", waist: "40-44", hips: "52", length: "39" },
      { size: "4XL", waist: "43-47", hips: "55", length: "39" },
    ],
    cm: [
      { size: "XS", waist: "61-69", hips: "94", length: "94" },
      { size: "S", waist: "69-79", hips: "99", length: "94" },
      { size: "M", waist: "74-84", hips: "104", length: "94" },
      { size: "L", waist: "79-89", hips: "109", length: "97" },
      { size: "XL", waist: "86-97", hips: "117", length: "97" },
      { size: "2XL", waist: "94-104", hips: "124", length: "99" },
      { size: "3XL", waist: "102-112", hips: "132", length: "99" },
      { size: "4XL", waist: "109-119", hips: "140", length: "99" },
    ],
  };

  const measurementTips = [
    {
      title: "Waist",
      description:
        "Measure around your waist at the level of your belly button. Keep the tape measure snug but not tight, and ensure it’s parallel to the floor. Record the measurement in inches.",
      icon: "📏",
    },
    {
      title: "Hips",
      description:
        "Measure around the fullest part of your hips and seat area (usually 8 inches below your waist). Keep the tape level all the way around. Record in inches.",
      icon: "📐",
    },
    {
      title: "Inseam",
      description:
        "Measure from the crotch seam down to the bottom of your ankle bone. Keep your leg straight for an accurate reading.",
      icon: "📏",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} size="xl">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Size Guide - Women's Pants
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedUnit("inches")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedUnit === "inches"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setSelectedUnit("cm")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedUnit === "cm"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Size Chart */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Waist ({selectedUnit})
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Hips ({selectedUnit})
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Length ({selectedUnit})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sizeData[selectedUnit].map((row, index) => (
                <motion.tr
                  key={row.size}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {row.size}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.waist}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.hips}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.length}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Tips */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <QuestionMarkCircleIcon className="w-5 h-5 mr-2 text-accent-rose" />
            How to Measure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {measurementTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{tip.icon}</span>
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fit Guide */}
        <div className="bg-accent-rose/10 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fit Guide
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              • <strong>Skinny:</strong> Fitted through the hip and thigh,
              tapered leg
            </li>
            <li>
              • <strong>Straight:</strong> Straight leg from hip to ankle
            </li>
            <li>
              • <strong>Bootcut:</strong> Fitted through the hip and thigh,
              slightly flared from knee
            </li>
            <li>
              • <strong>Wide Leg:</strong> Relaxed fit through hip and thigh,
              wide leg opening
            </li>
            <li>
              • <strong>High Waist:</strong> Sits at or above the natural
              waistline
            </li>
            <li>
              • <strong>Mid Rise:</strong> Sits just below the natural waistline
            </li>
            <li>
              • <strong>Low Rise:</strong> Sits at or below the hip bone
            </li>
          </ul>
        </div>

        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Measurements may vary by ±0.5 inches. For the best fit, we recommend
            measuring yourself and comparing with our size chart.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SizeGuide;
