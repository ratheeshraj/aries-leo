import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, calculateShipping, calculateTax } from '../utils/helpers';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { ShippingAddress, Order } from '../types';

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    phone: ''
  });

  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [useSameAddress, setUseSameAddress] = useState(true);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [cart.items, navigate, orderComplete]);

  // Calculate totals
  const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.product.price || 0) * item.quantity, 0);
  const shipping = calculateShipping(subtotal, 'IN');
  const tax = calculateTax(subtotal, shippingAddress.state);
  const total = subtotal + shipping + tax;

  const steps: CheckoutStep[] = [
    {
      id: 'shipping',
      title: 'Shipping',
      description: 'Delivery information',
      icon: <TruckIcon className="w-5 h-5" />
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Payment method',
      icon: <CreditCardIcon className="w-5 h-5" />
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Order summary',
      icon: <CheckIcon className="w-5 h-5" />
    }
  ];



  const handleAddressChange = (field: keyof ShippingAddress, value: string, type: 'shipping' | 'billing') => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
      if (useSameAddress) {
        setBillingAddress(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order number
      const newOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setOrderNumber(newOrderNumber);
      
      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
      
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(shippingAddress.firstName && shippingAddress.lastName && 
                 shippingAddress.address1 && shippingAddress.city && 
                 shippingAddress.state && shippingAddress.postalCode);
      case 2:
        return !!(cardDetails.number && cardDetails.expiry && 
                 cardDetails.cvv && cardDetails.name);
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="font-mono font-semibold text-gray-900">{orderNumber}</p>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            We'll send you an email confirmation with tracking information once your order ships.
          </p>
          <div className="space-y-3">
            <Link to="/">
              <Button fullWidth>
                Continue Shopping
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" fullWidth>
                View Orders
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <Link to="/cart" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep > index + 1
                        ? 'bg-accent-rose border-accent-rose text-white'
                        : currentStep === index + 1
                        ? 'border-accent-rose text-accent-rose'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {currentStep > index + 1 ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        currentStep > index + 1 ? 'bg-accent-rose' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="First Name"
                      value={shippingAddress.firstName}
                      onChange={(value) => handleAddressChange('firstName', value, 'shipping')}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(value) => handleAddressChange('lastName', value, 'shipping')}
                      required
                    />
                  </div>

                  <Input
                    label="Company (Optional)"
                    value={shippingAddress.company}
                    onChange={(value) => handleAddressChange('company', value, 'shipping')}
                    className="mb-4"
                  />

                  <Input
                    label="Address Line 1"
                    value={shippingAddress.address1}
                    onChange={(value) => handleAddressChange('address1', value, 'shipping')}
                    required
                    className="mb-4"
                  />

                  <Input
                    label="Address Line 2 (Optional)"
                    value={shippingAddress.address2}
                    onChange={(value) => handleAddressChange('address2', value, 'shipping')}
                    className="mb-4"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      label="City"
                      value={shippingAddress.city}
                      onChange={(value) => handleAddressChange('city', value, 'shipping')}
                      required
                    />
                    <Input
                      label="State"
                      value={shippingAddress.state}
                      onChange={(value) => handleAddressChange('state', value, 'shipping')}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      value={shippingAddress.postalCode}
                      onChange={(value) => handleAddressChange('postalCode', value, 'shipping')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="Phone"
                      value={shippingAddress.phone}
                      onChange={(value) => handleAddressChange('phone', value, 'shipping')}
                      type="tel"
                    />
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value, 'shipping')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-rose focus:border-transparent"
                    >
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>


                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                  
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-accent-rose focus:ring-accent-rose"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">Credit / Debit Card</p>
                            <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                          </div>
                        </label>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-accent-rose focus:ring-accent-rose"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">PayPal</p>
                            <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Card Details */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <Input
                          label="Card Number"
                          value={cardDetails.number}
                          onChange={(value) => setCardDetails(prev => ({ ...prev, number: value }))}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            value={cardDetails.expiry}
                            onChange={(value) => setCardDetails(prev => ({ ...prev, expiry: value }))}
                            placeholder="MM/YY"
                            required
                          />
                          <Input
                            label="CVV"
                            value={cardDetails.cvv}
                            onChange={(value) => setCardDetails(prev => ({ ...prev, cvv: value }))}
                            placeholder="123"
                            required
                          />
                        </div>

                        <Input
                          label="Cardholder Name"
                          value={cardDetails.name}
                          onChange={(value) => setCardDetails(prev => ({ ...prev, name: value }))}
                          required
                        />
                      </div>
                    )}

                    {/* Billing Address */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={useSameAddress}
                            onChange={(e) => setUseSameAddress(e.target.checked)}
                            className="rounded border-gray-300 text-accent-rose focus:ring-accent-rose"
                          />
                          <span className="ml-2 text-sm text-gray-700">Same as shipping address</span>
                        </label>
                      </div>

                      {!useSameAddress && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="First Name"
                              value={billingAddress.firstName}
                              onChange={(value) => handleAddressChange('firstName', value, 'billing')}
                              required
                            />
                            <Input
                              label="Last Name"
                              value={billingAddress.lastName}
                              onChange={(value) => handleAddressChange('lastName', value, 'billing')}
                              required
                            />
                          </div>

                          <Input
                            label="Address Line 1"
                            value={billingAddress.address1}
                            onChange={(value) => handleAddressChange('address1', value, 'billing')}
                            required
                          />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              label="City"
                              value={billingAddress.city}
                              onChange={(value) => handleAddressChange('city', value, 'billing')}
                              required
                            />
                            <Input
                              label="State"
                              value={billingAddress.state}
                              onChange={(value) => handleAddressChange('state', value, 'billing')}
                              required
                            />
                            <Input
                              label="ZIP Code"
                              value={billingAddress.postalCode}
                              onChange={(value) => handleAddressChange('postalCode', value, 'billing')}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Review</h2>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center p-4 border rounded-lg">
                        <img
                          src={Array.isArray(item.product.images) && item.product.images.length > 0
                            ? (typeof item.product.images[0] === 'string' 
                                ? item.product.images[0] 
                                : item.product.images[0].original || item.product.images[0].medium)
                            : '/placeholder-product.jpg'
                          }
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency((item.product.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Information */}
                  <div className="border-t pt-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p className="text-gray-600">{shippingAddress.address1}</p>
                      {shippingAddress.address2 && (
                        <p className="text-gray-600">{shippingAddress.address2}</p>
                      )}
                      <p className="text-gray-600">
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600">{shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">
                        {paymentMethod === 'card' ? 'Credit / Debit Card' : 'PayPal'}
                      </p>
                      {paymentMethod === 'card' && cardDetails.number && (
                        <p className="text-gray-600">•••• •••• •••• {cardDetails.number.slice(-4)}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
              >
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !validateStep(currentStep)}
                  isLoading={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <img
                      src={Array.isArray(item.product.images) && item.product.images.length > 0
                        ? (typeof item.product.images[0] === 'string' 
                            ? item.product.images[0] 
                            : item.product.images[0].original || item.product.images[0].medium)
                        : '/placeholder-product.jpg'
                      }
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity} × {formatCurrency(item.product.price || 0)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                      {formatCurrency((item.product.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping === 0 && subtotal >= 2000 && (
                  <p className="text-xs text-green-600">
                    🎉 Free shipping on orders over ₹2000!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-gray-600">
                    Add {formatCurrency(2000 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Secure Checkout</p>
                    <p className="text-xs text-green-700">Your payment information is encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 