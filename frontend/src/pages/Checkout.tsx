import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import useAuth from "../hooks/useAuth";
import { formatCurrency, calculateShipping } from "../utils/helpers";
import { orderAPI } from "../utils/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { ShippingAddress, Product } from "../types";

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, token, isAuthenticated } = useAppContext();
  const { getProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
    phone: "",
  });

  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const [useSameAddress, setUseSameAddress] = useState(true);

  // Discount code states
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

  // Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [cart.items, navigate, orderComplete]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch saved addresses when component mounts
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (isAuthenticated && token) {
        setLoadingAddresses(true);
        try {
          const profileData = await getProfile();
          if (profileData && profileData.addresses) {
            setSavedAddresses(profileData.addresses);
          }
        } catch (error) {
          console.error("Error fetching saved addresses:", error);
        } finally {
          setLoadingAddresses(false);
        }
      }
    };

    fetchSavedAddresses();
  }, []);

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum: number, item: { product: Product; quantity: number }) =>
      sum +
      (item.product.compareAtPrice || item.product.costPrice || 0) *
        item.quantity,
    0
  );
  const shipping = calculateShipping(subtotal);
  const discountAmount = appliedDiscount
    ? Math.min(
        appliedDiscount.value,
        appliedDiscount.maxDiscountAmount || appliedDiscount.value
      )
    : 0;
  const total = subtotal + shipping - discountAmount;

  const steps: CheckoutStep[] = [
    {
      id: "shipping",
      title: "Shipping",
      description: "Delivery information",
      icon: <TruckIcon className="w-5 h-5" />,
    },
    {
      id: "payment",
      title: "Payment",
      description: "Payment method",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
    {
      id: "review",
      title: "Review",
      description: "Order summary",
      icon: <CheckIcon className="w-5 h-5" />,
    },
  ];

  const handleAddressChange = (
    field: keyof ShippingAddress,
    value: string,
    type: "shipping" | "billing"
  ) => {
    if (type === "shipping") {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
      if (useSameAddress) {
        setBillingAddress((prev) => ({ ...prev, [field]: value }));
      }
      // Clear selected address when user manually edits
      setSelectedAddressIndex(null);
    } else {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle selecting a saved address
  const handleSelectSavedAddress = (address: any, index: number) => {
    const mappedAddress: ShippingAddress = {
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      company: address.company || "",
      address1: address.street || address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "IN",
      phone: address.phone || "",
    };

    setShippingAddress(mappedAddress);
    if (useSameAddress) {
      setBillingAddress(mappedAddress);
    }

    // Show success message and track selected address
    setAddressSelected(true);
    setSelectedAddressIndex(index);
    setTimeout(() => setAddressSelected(false), 3000);
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

  // Validate discount code
  const validateDiscountCode = async (code: string) => {
    console.log(code);
    if (!code.trim()) {
      setDiscountError("");
      setAppliedDiscount(null);
      return;
    }

    setIsValidatingDiscount(true);
    setDiscountError("");

    try {
      // Get discount codes from localStorage
      const storedDiscounts = localStorage.getItem("discounts");
      if (!storedDiscounts) {
        setDiscountError("No discount codes available");
        return;
      }

      const discounts = JSON.parse(storedDiscounts);
      console.log(discounts);
      const discount = discounts.find(
        (d: any) =>
          d.code?.toUpperCase() === code.toUpperCase() &&
          d.status === "active" &&
          d.isActive
      );

      if (!discount) {
        setDiscountError("Invalid discount code");
        return;
      }

      // Check if discount is within date range
      const now = new Date();
      const startDate = new Date(discount.startDate);
      const endDate = discount.endDate ? new Date(discount.endDate) : null;

      if (now < startDate || (endDate && now > endDate)) {
        setDiscountError("Discount code has expired");
        return;
      }

      // Check minimum purchase amount
      if (discount.minPurchaseAmount && subtotal < discount.minPurchaseAmount) {
        setDiscountError(
          `Minimum purchase amount of ${formatCurrency(
            discount.minPurchaseAmount
          )} required`
        );
        return;
      }

      // Check usage limit
      if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
        setDiscountError("Discount code usage limit exceeded");
        return;
      }

      setAppliedDiscount(discount);
      setDiscountError("");
    } catch (error) {
      console.error("Error validating discount code:", error);
      setDiscountError("Error validating discount code");
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const handleApplyDiscount = () => {
    validateDiscountCode(discountCode);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      if (!token) {
        throw new Error("Authentication required");
      }

      const orderData = {
        orderItems: cart.items.map(
          (item: {
            product: Product;
            quantity: number;
            selectedSize?: string;
            selectedColor?: string;
            inventoryId?: string;
          }) => ({
            name: item.product.name,
            qty: item.quantity,
            image:
              Array.isArray(item.product.images) &&
              item.product.images.length > 0
                ? typeof item.product.images[0] === "string"
                  ? item.product.images[0]
                  : item.product.images[0].original ||
                    item.product.images[0].medium ||
                    item.product.images[0].thumb
                : "/placeholder-product.jpg",
            price: item.product.compareAtPrice || item.product.costPrice || 0,
            salePrice: item.product.salePrice || 0,
            discountPercentage: 0, // Will be calculated by backend if needed
            inventory: item.inventoryId,
          })
        ),
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          street: shippingAddress.address1,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
        paymentMethod: paymentMethod === "card" ? "Razorpay" : paymentMethod,
        itemsPrice: subtotal,
        taxPrice: 0, // Will be calculated by backend
        shippingPrice: shipping,
        totalPrice: total,
        discountAmount: discountAmount,
        couponCode: appliedDiscount?.code || null,
        couponUsageTracked: appliedDiscount ? true : false,
        couponApplied: appliedDiscount ? true : false,
      };

      console.log(orderData);

      const response = await orderAPI.createOrder(orderData, token);
      const newOrderNumber = response._id || `ORD-${Date.now()}`;
      setOrderNumber(newOrderNumber);

      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
    } catch (error) {
      console.error("Order processing failed:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          shippingAddress.firstName &&
          shippingAddress.lastName &&
          shippingAddress.address1 &&
          shippingAddress.city &&
          shippingAddress.state &&
          shippingAddress.postalCode
        );
      case 2:
        return !!(
          cardDetails.number &&
          cardDetails.expiry &&
          cardDetails.cvv &&
          cardDetails.name
        );
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="font-mono font-semibold text-gray-900">
              {orderNumber}
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            We'll send you an email confirmation with tracking information once
            your order ships.
          </p>
          <div className="space-y-3">
            <Link to="/">
              <Button fullWidth>Continue Shopping</Button>
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
            <Link
              to="/cart"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
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
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep > index + 1
                          ? "bg-accent-rose border-accent-rose text-white"
                          : currentStep === index + 1
                          ? "border-accent-rose text-accent-rose"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {currentStep > index + 1 ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= index + 1
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-4 ${
                          currentStep > index + 1
                            ? "bg-accent-rose"
                            : "bg-gray-300"
                        }`}
                      />
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Shipping Information
                  </h2>

                  {/* Saved Addresses */}
                  {loadingAddresses ? (
                    <p className="text-center text-gray-500 py-4">
                      Loading saved addresses...
                    </p>
                  ) : savedAddresses.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Saved Addresses
                        </h3>
                      </div>
                      {savedAddresses.map((address, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedAddressIndex === index
                              ? "border-accent-rose bg-accent-rose/5"
                              : "border-gray-200 hover:bg-gray-50 hover:border-accent-rose"
                          }`}
                          onClick={() =>
                            handleSelectSavedAddress(address, index)
                          }
                        >
                          <MapPinIcon className="w-5 h-5 text-gray-500 mr-3" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.city}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.state}, {address.postalCode}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.country}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-gray-600">
                                {address.phone}
                              </p>
                            )}
                          </div>
                          <div className="text-accent-rose">
                            {selectedAddressIndex === index ? (
                              <div className="flex items-center">
                                <CheckIcon className="w-4 h-4 mr-1" />
                                <p className="text-xs font-medium">Selected</p>
                              </div>
                            ) : (
                              <p className="text-xs font-medium">
                                Click to use
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 mb-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <MapPinIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No saved addresses found</p>
                      <p className="text-sm text-gray-400">
                        Add addresses in your profile for faster checkout
                      </p>
                      <Link
                        to="/profile"
                        className="inline-block mt-2 text-accent-rose hover:text-accent-rose-dark text-sm font-medium"
                      >
                        Go to Profile
                      </Link>
                    </div>
                  )}

                  {/* Separator */}
                  {savedAddresses.length > 0 && (
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Or enter a new address
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {addressSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-green-800 text-sm">
                        ✓ Address selected! You can modify the details below if
                        needed.
                      </p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="First Name"
                      value={shippingAddress.firstName}
                      onChange={(value) =>
                        handleAddressChange("firstName", value, "shipping")
                      }
                      required
                    />
                    <Input
                      label="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(value) =>
                        handleAddressChange("lastName", value, "shipping")
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Company (Optional)"
                    value={shippingAddress.company}
                    onChange={(value) =>
                      handleAddressChange("company", value, "shipping")
                    }
                    className="mb-4"
                  />

                  <Input
                    label="Address Line 1"
                    value={shippingAddress.address1}
                    onChange={(value) =>
                      handleAddressChange("address1", value, "shipping")
                    }
                    required
                    className="mb-4"
                  />

                  <Input
                    label="Address Line 2 (Optional)"
                    value={shippingAddress.address2}
                    onChange={(value) =>
                      handleAddressChange("address2", value, "shipping")
                    }
                    className="mb-4"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      label="City"
                      value={shippingAddress.city}
                      onChange={(value) =>
                        handleAddressChange("city", value, "shipping")
                      }
                      required
                    />
                    <Input
                      label="State"
                      value={shippingAddress.state}
                      onChange={(value) =>
                        handleAddressChange("state", value, "shipping")
                      }
                      required
                    />
                    <Input
                      label="ZIP Code"
                      value={shippingAddress.postalCode}
                      onChange={(value) =>
                        handleAddressChange("postalCode", value, "shipping")
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="Phone"
                      value={shippingAddress.phone}
                      onChange={(value) =>
                        handleAddressChange("phone", value, "shipping")
                      }
                      type="tel"
                    />
                    <select
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleAddressChange(
                          "country",
                          e.target.value,
                          "shipping"
                        )
                      }
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Payment Information
                  </h2>

                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Payment Method
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-accent-rose focus:ring-accent-rose"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">
                              Credit / Debit Card
                            </p>
                            <p className="text-sm text-gray-600">
                              Visa, Mastercard, American Express
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value="paypal"
                            checked={paymentMethod === "paypal"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-accent-rose focus:ring-accent-rose"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">PayPal</p>
                            <p className="text-sm text-gray-600">
                              Pay with your PayPal account
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Card Details */}
                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <Input
                          label="Card Number"
                          value={cardDetails.number}
                          onChange={(value) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              number: value,
                            }))
                          }
                          placeholder="1234 5678 9012 3456"
                          required
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            value={cardDetails.expiry}
                            onChange={(value) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                expiry: value,
                              }))
                            }
                            placeholder="MM/YY"
                            required
                          />
                          <Input
                            label="CVV"
                            value={cardDetails.cvv}
                            onChange={(value) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                cvv: value,
                              }))
                            }
                            placeholder="123"
                            required
                          />
                        </div>

                        <Input
                          label="Cardholder Name"
                          value={cardDetails.name}
                          onChange={(value) =>
                            setCardDetails((prev) => ({ ...prev, name: value }))
                          }
                          required
                        />
                      </div>
                    )}

                    {/* Billing Address */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Billing Address
                        </h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={useSameAddress}
                            onChange={(e) =>
                              setUseSameAddress(e.target.checked)
                            }
                            className="rounded border-gray-300 text-accent-rose focus:ring-accent-rose"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Same as shipping address
                          </span>
                        </label>
                      </div>

                      {!useSameAddress && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="First Name"
                              value={billingAddress.firstName}
                              onChange={(value) =>
                                handleAddressChange(
                                  "firstName",
                                  value,
                                  "billing"
                                )
                              }
                              required
                            />
                            <Input
                              label="Last Name"
                              value={billingAddress.lastName}
                              onChange={(value) =>
                                handleAddressChange(
                                  "lastName",
                                  value,
                                  "billing"
                                )
                              }
                              required
                            />
                          </div>

                          <Input
                            label="Address Line 1"
                            value={billingAddress.address1}
                            onChange={(value) =>
                              handleAddressChange("address1", value, "billing")
                            }
                            required
                          />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              label="City"
                              value={billingAddress.city}
                              onChange={(value) =>
                                handleAddressChange("city", value, "billing")
                              }
                              required
                            />
                            <Input
                              label="State"
                              value={billingAddress.state}
                              onChange={(value) =>
                                handleAddressChange("state", value, "billing")
                              }
                              required
                            />
                            <Input
                              label="ZIP Code"
                              value={billingAddress.postalCode}
                              onChange={(value) =>
                                handleAddressChange(
                                  "postalCode",
                                  value,
                                  "billing"
                                )
                              }
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Review
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map(
                      (
                        item: { product: Product; quantity: number },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="flex items-center p-4 border rounded-lg"
                        >
                          <img
                            src={
                              Array.isArray(item.product.images) &&
                              item.product.images.length > 0
                                ? typeof item.product.images[0] === "string"
                                  ? item.product.images[0]
                                  : item.product.images[0].original ||
                                    item.product.images[0].medium ||
                                    item.product.images[0].thumb
                                : "/placeholder-product.jpg"
                            }
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(
                                (item.product.compareAtPrice ||
                                  item.product.costPrice ||
                                  0) * item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Shipping Information */}
                  <div className="border-t pt-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Shipping Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p className="text-gray-600">
                        {shippingAddress.address1}
                      </p>
                      {shippingAddress.address2 && (
                        <p className="text-gray-600">
                          {shippingAddress.address2}
                        </p>
                      )}
                      <p className="text-gray-600">
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600">{shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Order Total
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">
                          {shipping === 0 ? "Free" : formatCurrency(shipping)}
                        </span>
                      </div>
                      {appliedDiscount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">
                            Discount ({appliedDiscount.code})
                          </span>
                          <span className="text-green-600">
                            -{formatCurrency(discountAmount)}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Payment Method
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">
                        {paymentMethod === "card"
                          ? "Credit / Debit Card"
                          : "PayPal"}
                      </p>
                      {paymentMethod === "card" && cardDetails.number && (
                        <p className="text-gray-600">
                          •••• •••• •••• {cardDetails.number.slice(-4)}
                        </p>
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
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map(
                  (
                    item: {
                      product: Product;
                      quantity: number;
                      selectedSize?: string;
                      selectedColor?: string;
                      inventoryId?: string;
                    },
                    index: number
                  ) => (
                    <div key={index} className="flex items-start gap-3">
                      <img
                        src={
                          Array.isArray(item.product.images) &&
                          item.product.images.length > 0
                            ? typeof item.product.images[0] === "string"
                              ? item.product.images[0]
                              : item.product.images[0].original ||
                                item.product.images[0].medium ||
                                item.product.images[0].thumb
                            : "/placeholder-product.jpg"
                        }
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        {/* Display selected size and color */}
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedSize && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} ×{" "}
                          {formatCurrency(
                            item.product.compareAtPrice ||
                              item.product.costPrice ||
                              0
                          )}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                        {formatCurrency(
                          (item.product.compareAtPrice ||
                            item.product.costPrice ||
                            0) * item.quantity
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Discount Code */}
              <div className="border-t pt-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Discount Code
                </h3>
                {!appliedDiscount ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={discountCode}
                        onChange={setDiscountCode}
                        placeholder="Enter discount code"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={!discountCode.trim() || isValidatingDiscount}
                        variant="outline"
                        size="sm"
                      >
                        {isValidatingDiscount ? "Validating..." : "Apply"}
                      </Button>
                    </div>
                    {discountError && (
                      <p className="text-xs text-red-600">{discountError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {appliedDiscount.code}
                      </p>
                      <p className="text-xs text-green-700">
                        Save {formatCurrency(discountAmount)}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Discount ({appliedDiscount.code})
                    </span>
                    <span className="text-green-600">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
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
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div> */}
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
                    <p className="text-sm font-medium text-green-900">
                      Secure Checkout
                    </p>
                    <p className="text-xs text-green-700">
                      Your payment information is encrypted
                    </p>
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
