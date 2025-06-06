import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: ''
  });

  const [formType, setFormType] = useState<'general' | 'support' | 'wholesale'>('general');

  const handleInputChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      orderNumber: ''
    });
  };

  const contactInfo = [
    {
      icon: <MapPinIcon className="w-6 h-6" />,
      title: "Visit Our Showroom",
      details: [
        "123 Fashion District",
        "New York, NY 10001",
        "United States"
      ]
    },
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      title: "Call Us",
      details: [
        "+1 (555) 123-4567",
        "Mon-Fri: 9AM-6PM EST",
        "Weekend: 10AM-4PM EST"
      ]
    },
    {
      icon: <EnvelopeIcon className="w-6 h-6" />,
      title: "Email Us",
      details: [
        "hello@ariesleo.com",
        "support@ariesleo.com",
        "wholesale@ariesleo.com"
      ]
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Response Time",
      details: [
        "Email: Within 24 hours",
        "Phone: Immediate",
        "Chat: Within 5 minutes"
      ]
    }
  ];

  const faqs = [
    {
      question: "What is your return policy for women's bottoms?",
      answer: "We offer a 30-day return policy for all unworn items with original tags. Returns are free for exchanges and defective items."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for next-day delivery in most areas."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship to over 25 countries worldwide. International shipping typically takes 7-14 business days."
    },
    {
      question: "How do I find the right size for my body type?",
      answer: "Check our detailed size guide on each product page, designed specifically for women's measurements. We also offer free exchanges if the size doesn't fit perfectly."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {/* Form Type Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What can we help you with?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'general', label: 'General Inquiry', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
                    { id: 'support', label: 'Customer Support', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> },
                    { id: 'wholesale', label: 'Wholesale', icon: <EnvelopeIcon className="w-5 h-5" /> }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormType(type.id as typeof formType)}
                      className={`p-4 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                        formType === type.id
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {type.icon}
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    placeholder="Your full name"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                {formType === 'support' && (
                  <Input
                    label="Order Number (Optional)"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange('orderNumber')}
                    placeholder="AL-12345"
                  />
                )}

                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                  required
                  placeholder={
                    formType === 'general' ? "What's your inquiry about?" :
                    formType === 'support' ? "Issue with your order" :
                    "Wholesale partnership inquiry"
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleTextAreaChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder={
                      formType === 'general' ? "Tell us more about your inquiry..." :
                      formType === 'support' ? "Please describe the issue you're experiencing..." :
                      "Tell us about your business and wholesale needs..."
                    }
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-primary-600 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href="/faq"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View all FAQs →
                </a>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              className="bg-red-50 rounded-2xl p-6 border border-red-200"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Urgent Issue?
              </h3>
              <p className="text-red-700 text-sm mb-3">
                For urgent matters like payment issues or order problems, call us directly.
              </p>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center gap-2 text-red-700 font-medium hover:text-red-800"
              >
                <PhoneIcon className="w-4 h-4" />
                +1 (555) 123-4567
              </a>
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Visit Our Showroom</h2>
              <p className="text-gray-600 mb-6">
                Come see and feel our pants in person. Our showroom is open Monday through Saturday.
              </p>
            </div>
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPinIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Interactive map would be integrated here</p>
                <p className="text-sm">123 Fashion District, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Newsletter Signup */}
        <motion.section
          className="mt-16 bg-primary-600 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-primary-100 mb-6">
            Subscribe to our newsletter for updates, exclusive offers, and style tips.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            />
            <Button variant="secondary" size="lg">
              Subscribe
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Contact;
