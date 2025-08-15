import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useScrollToTop } from '../hooks/useScrollToTop';
import useAuth from '../hooks/useAuth';
import { orderAPI, authAPI } from '../utils/api';
import logo from '../assets/aries-leo-logo.png';
import { useAppContext } from '../context/AppContext';

export const Profile: React.FC = () => {
  useScrollToTop();
  
  const { user, isAuthenticated, logout, getProfile } = useAuth();
  const { token } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<any>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility state
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Success and error messages
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [addressError, setAddressError] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Handle accordion toggle
  const toggleAccordion = (orderId: string) => {
    setOpenAccordion(openAccordion === orderId ? null : orderId);
  };

  // Function to get the least status from order items
  const getLeastStatus = (orderItems: any[]) => {
    if (!orderItems || orderItems.length === 0) return 'Unknown';
    
    // Define status hierarchy (from least to most advanced)
    const statusHierarchy = [
      'open',
      'processing', 
      'shipped',
      'delivered',
      'return',
      'refund in progress',
      'refunded',
      'cancelled',
      'replacement'
    ];
    
    // Get all unique statuses from order items
    const itemStatuses = orderItems
      .map(item => (item.orderStatus || 'unknown').toLowerCase())
      .filter(status => status !== 'unknown');
    
    if (itemStatuses.length === 0) return 'Unknown';
    
    // Find the least status by finding the minimum index in the hierarchy
    let leastStatusIndex = statusHierarchy.length - 1;
    let leastStatus = 'replacement';
    
    itemStatuses.forEach(status => {
      const statusIndex = statusHierarchy.indexOf(status);
      if (statusIndex !== -1 && statusIndex < leastStatusIndex) {
        leastStatusIndex = statusIndex;
        leastStatus = status;
      }
    });
    
    return leastStatus.charAt(0).toUpperCase() + leastStatus.slice(1);
  };

  // Function to get status styles for the accordion header
  const getHeaderStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          dot: 'bg-blue-500'
        };
      case 'processing':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          dot: 'bg-yellow-500'
        };
      case 'shipped':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'delivered':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          dot: 'bg-green-500'
        };
      case 'return':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          border: 'border-orange-200',
          dot: 'bg-orange-500'
        };
      case 'refund in progress':
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          border: 'border-indigo-200',
          dot: 'bg-indigo-500'
        };
      case 'refunded':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          dot: 'bg-gray-500'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          dot: 'bg-red-500'
        };
      case 'replacement':
        return {
          bg: 'bg-pink-100',
          text: 'text-pink-800',
          border: 'border-pink-200',
          dot: 'bg-pink-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          dot: 'bg-gray-500'
        };
    }
  };

  // Fetch profile data when addresses tab is active
  useEffect(() => {
    const fetchProfileData = async () => {
      if (activeTab === 'addresses') {
        setLoading(true);
        try {
          const data = await getProfile();
          if (data) {
            setProfileData(data);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [activeTab]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders' && token) {
        setOrdersLoading(true);
        try {
          const ordersData = await orderAPI.getMyOrders(token);
          console.log('Orders data:', ordersData);
          // Ensure ordersData is an array
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab, token]);

  // Update form data when user data is loaded
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getProfile();
      if (user) {
        setProfileForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    }
    fetchUser();
  }, []);

  // Handle profile form input changes
  const handleProfileInputChange = (name: string) => (value: string) => {
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
    // Clear messages when user starts typing
    setProfileSuccess('');
    setProfileError('');
  };

  // Handle address form input changes
  const handleAddressInputChange = (name: string) => (value: string) => {
    setAddressForm({
      ...addressForm,
      [name]: value,
    });
    // Clear messages when user starts typing
    setAddressSuccess('');
    setAddressError('');
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(profileForm, 'profileForm')
    // Validate passwords if changing
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileError('New passwords do not match');
      return;
    }

    if (!token) {
      setProfileError('Authentication token not found. Please login again.');
      return;
    }

    try {
      const updateData: any = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      };

      if (profileForm.newPassword) {
        updateData.oldPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      const response = await authAPI.updateProfile(token, updateData);
      console.log(response, 'response')
      if (response) {
        setProfileSuccess('Profile updated successfully!');
        // Clear password fields
        setProfileForm({
          ...profileForm,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setProfileError('Failed to update profile. Please try again.');
      }
    } catch (error: any) {
      setProfileError(error.message || 'An error occurred while updating profile');
    }
  };

  // Handle address addition
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!addressForm.firstName || !addressForm.lastName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode) {
      setAddressError('Please fill in all required fields');
      return;
    }

    if (!token) {
      setAddressError('Authentication token not found. Please login again.');
      return;
    }

    // Debug logging
    console.log('Submitting address form:', addressForm);

    try {
      const response = await authAPI.addAddress(token, addressForm);
      
      console.log('Address API response:', response);
      
      if (response) {
        setAddressSuccess('Address added successfully!');
        // Clear form
        setAddressForm({
          firstName: '',
          lastName: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
        });
        // Refresh profile data to show the new address
        const updatedProfileData = await getProfile();
        if (updatedProfileData) {
          setProfileData(updatedProfileData);
        }
      } else {
        setAddressError('Failed to add address. Please try again.');
      }
    } catch (error: any) {
      console.error('Error adding address:', error);
      setAddressError(error.message || 'An error occurred while adding address');
    }
  };

  // Handle address removal
  const handleRemoveAddress = async (addressId: string) => {
    try {
      if (!profileData?.addresses) {
        setAddressError('No addresses found');
        return;
      }

      if (!token) {
        setAddressError('Authentication token not found. Please login again.');
        return;
      }

      const response = await authAPI.deleteAddress(token, addressId);
      
      if (response) {
        setAddressSuccess('Address removed successfully!');
        // Refresh profile data to show the updated addresses
        const updatedProfileData = await getProfile();
        if (updatedProfileData) {
          setProfileData(updatedProfileData);
        }
      } else {
        setAddressError('Failed to remove address. Please try again.');
      }
    } catch (error: any) {
      setAddressError(error.message || 'An error occurred while removing address');
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rose"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-rose focus:ring-offset-2 rounded-lg p-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Aries Leo Logo" className="h-68 w-68 mx-auto mb-4 cursor-pointer" onClick={() => window.location.href = '/'}/>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-accent-rose text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-accent-rose text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPinIcon className="w-5 h-5" />
                <span>Addresses</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-accent-rose text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Orders</span>
              </button>
              
              {/* <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'wishlist'
                    ? 'bg-accent-rose text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <HeartIcon className="w-5 h-5" />
                <span>Wishlist</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-accent-rose text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CogIcon className="w-5 h-5" />
                <span>Settings</span>
              </button> */}
            </nav>

            {/* Logout Button */}
            <div className="mt-6">
              <Button
                onClick={logout}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8">Profile Information</h2>
                  
                  {profileSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">{profileSuccess}</p>
                    </div>
                  )}
                  
                  {profileError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{profileError}</p>
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <Input
                      label="Full Name"
                      value={profileForm.name}
                      onChange={handleProfileInputChange('name')}
                      leftIcon={<UserIcon className="h-5 w-5" />}
                      placeholder="Enter your full name"
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileInputChange('email')}
                      leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                      placeholder="Enter your email address"
                    />
                    
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={profileForm.phone}
                      onChange={handleProfileInputChange('phone')}
                      leftIcon={<PhoneIcon className="h-5 w-5" />}
                      placeholder="Enter your phone number"
                    />

                    <div className="border-t pt-8">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>  
                      <div className="space-y-6">
                        <Input
                          label="Current Password"
                          type={passwordVisibility.currentPassword ? 'text' : 'password'}
                          value={profileForm.currentPassword}
                          onChange={handleProfileInputChange('currentPassword')}
                          placeholder="Enter current password"
                          rightIcon={passwordVisibility.currentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                          onIconClick={() => setPasswordVisibility({ ...passwordVisibility, currentPassword: !passwordVisibility.currentPassword })}
                        />
                        
                        <Input
                          label="New Password"
                          type={passwordVisibility.newPassword ? 'text' : 'password'}
                          value={profileForm.newPassword}
                          onChange={handleProfileInputChange('newPassword')}
                          placeholder="Enter new password"
                          rightIcon={passwordVisibility.newPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                          onIconClick={() => setPasswordVisibility({ ...passwordVisibility, newPassword: !passwordVisibility.newPassword })}
                        />
                        
                        <Input
                          label="Confirm New Password"
                          type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                          value={profileForm.confirmPassword}
                          onChange={handleProfileInputChange('confirmPassword')}
                          placeholder="Confirm new password"
                          rightIcon={passwordVisibility.confirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                          onIconClick={() => setPasswordVisibility({ ...passwordVisibility, confirmPassword: !passwordVisibility.confirmPassword })}
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="primary" className="w-full">
                      Update Profile
                    </Button>
                  </form>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Manage Addresses</h2>
                  
                  {addressSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">{addressSuccess}</p>
                    </div>
                  )}
                  
                  {addressError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{addressError}</p>
                    </div>
                  )}

                  {/* Existing Addresses */}
                  {profileData?.addresses && profileData.addresses.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Addresses ({profileData.addresses.length})</h3>
                      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                        {profileData.addresses.map((address: any, index: number) => (
                          <div key={address._id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {address.firstName || 'N/A'} {address.lastName || 'N/A'}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {address.phone || 'N/A'}
                                </p>
                                <p className="text-gray-600 text-sm truncate">{address.street || 'N/A'}</p>
                                <p className="text-gray-600 text-sm">
                                  {address.city || 'N/A'}, {address.state || 'N/A'} {address.postalCode || 'N/A'}
                                </p>
                                <p className="text-gray-600 text-sm">{address.country || 'N/A'}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveAddress(address._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium ml-4 flex-shrink-0 px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Address Form */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                    
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          value={addressForm.firstName}
                          onChange={handleAddressInputChange('firstName')}
                          placeholder="Enter first name"
                        />
                        
                        <Input
                          label="Last Name"
                          value={addressForm.lastName}
                          onChange={handleAddressInputChange('lastName')}
                          placeholder="Enter last name"
                        />
                      </div>
                      
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={addressForm.phone}
                        onChange={handleAddressInputChange('phone')}
                        leftIcon={<PhoneIcon className="h-5 w-5" />}
                        placeholder="Enter phone number"
                      />
                      
                      <Input
                        label="Street Address"
                        value={addressForm.street}
                        onChange={handleAddressInputChange('street')}
                        placeholder="Enter street address"
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="City"
                          value={addressForm.city}
                          onChange={handleAddressInputChange('city')}
                          placeholder="Enter city"
                        />
                        
                        <Input
                          label="State"
                          value={addressForm.state}
                          onChange={handleAddressInputChange('state')}
                          placeholder="Enter state"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Postal Code"
                          value={addressForm.postalCode}
                          onChange={handleAddressInputChange('postalCode')}
                          placeholder="Enter postal code"
                        />
                        
                        <Input
                          label="Country"
                          value={addressForm.country}
                          onChange={handleAddressInputChange('country')}
                          placeholder="Enter country"
                        />
                      </div>

                      <Button type="submit" variant="primary" className="w-full">
                        Add Address
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
                  {ordersLoading ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rose mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading your orders...</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any, index: number) => {
                        // Handle MongoDB ObjectId and Date fields
                        const orderId = order._id?.$oid || order._id || order.id || `order-${index}`;
                        const orderDate = order.createdAt?.$date || order.createdAt;
                        const isOpen = openAccordion === orderId;
                        
                        return (
                          <motion.div 
                            key={orderId} 
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            {/* Accordion Header */}
                            <button
                              onClick={() => toggleAccordion(orderId)}
                              className="w-full bg-gradient-to-r from-accent-rose to-accent-mauve px-6 py-4 relative hover:from-accent-mauve hover:to-accent-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-accent-rose"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                              <div className="relative z-10 flex justify-between items-center">
                                <div className="flex-1 text-left">
                                  <h3 className="text-xl font-bold text-black flex items-center">
                                    <ShoppingBagIcon className="w-6 h-6 mr-2" />
                                    Order #{orderId}
                                  </h3>
                                  <p className="text-black/80 text-sm mt-1">
                                    {orderDate ? new Date(orderDate).toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    }) : 'N/A'}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="flex flex-col items-end space-y-2">    
                                    {/* Order Status - Shows the least status from all items */}
                                    {order.orderItems && order.orderItems.length > 0 && (
                                      (() => {
                                        const leastStatus = getLeastStatus(order.orderItems);
                                        const statusStyles = getHeaderStatusStyles(leastStatus);
                                        return (
                                          <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 ${statusStyles.dot}`}></div>
                                            {leastStatus}
                                          </div>
                                        );
                                      })()
                                    )}
                                  </div>
                                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full transition-all duration-200 hover:bg-white/30">
                                    <motion.div
                                      animate={{ rotate: isOpen ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronDownIcon className="w-5 h-5 text-black" />
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </button>

                            {/* Accordion Content */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ 
                                    duration: 0.3, 
                                    ease: "easeInOut",
                                    opacity: { duration: 0.2 }
                                  }}
                                  className="overflow-hidden"
                                >
                                  <motion.div 
                                    className="p-6 border-t border-gray-200"
                                    initial={{ y: -10 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                  >
                                    {/* Pricing Section */}
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
                                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <ShoppingBagIcon className="w-5 h-5 mr-2 text-accent-rose" />
                                        Order Summary
                                      </h4>
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                          <span className="text-gray-600">Items Price:</span>
                                          <span className="font-medium">₹{order.itemsPrice || 0}</span>
                                        </div>
                                        {order.taxPrice > 0 && (
                                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Tax:</span>
                                            <span className="font-medium">₹{order.taxPrice || 0}</span>
                                          </div>
                                        )}
                                        {order.shippingPrice > 0 && (
                                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Shipping:</span>
                                            <span className="font-medium">₹{order.shippingPrice || 0}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2">
                                          <span className="font-semibold text-gray-900 text-lg">Total:</span>
                                          <span className="font-bold text-2xl text-accent-rose">₹{order.totalPrice || order.totalAmount || 0}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="mb-6">
                                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <EnvelopeIcon className="w-5 h-5 mr-2 text-accent-rose" />
                                        Payment Information
                                      </h4>
                                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600">
                                          <span className="font-medium">Method:</span> {order.paymentMethod || 'N/A'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Shipping Address */}
                                    {order.shippingAddress && (
                                      <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                          <MapPinIcon className="w-5 h-5 mr-2 text-accent-rose" />
                                          Shipping Address
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                          <div className="space-y-2">
                                            <p className="font-medium text-gray-900 text-lg">
                                              {order.shippingAddress.firstName || ''} {order.shippingAddress.lastName || ''}
                                            </p>
                                            <p className="text-gray-600">
                                              {order.shippingAddress.street || ''}, {order.shippingAddress.city || ''}, {order.shippingAddress.state || ''} {order.shippingAddress.postalCode || ''}
                                            </p>
                                            <p className="text-gray-600">{order.shippingAddress.country || ''}</p>
                                            {order.shippingAddress.phone && (
                                              <p className="text-gray-600 flex items-center">
                                                <PhoneIcon className="w-4 h-4 mr-2 text-accent-rose" />
                                                {order.shippingAddress.phone}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Order Items */}
                                    <div>
                                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <ShoppingBagIcon className="w-5 h-5 mr-2 text-accent-rose" />
                                        Order Items
                                      </h4>
                                      <div className="space-y-3">
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                          order.orderItems.map((item: any, itemIndex: number) => {
                                            const itemId = item._id?.$oid || item._id || item.id || `item-${itemIndex}`;
                                            const itemStatus = item.orderStatus || 'Unknown';
                                            
                                            // Define status colors and styles
                                            const getStatusStyles = (status: string) => {
                                              switch (status.toLowerCase()) {
                                                case 'open':
                                                  return {
                                                    bg: 'bg-blue-100',
                                                    text: 'text-blue-800',
                                                    border: 'border-blue-200',
                                                    dot: 'bg-blue-500'
                                                  };
                                                case 'processing':
                                                  return {
                                                    bg: 'bg-yellow-100',
                                                    text: 'text-yellow-800',
                                                    border: 'border-yellow-200',
                                                    dot: 'bg-yellow-500'
                                                  };
                                                case 'shipped':
                                                  return {
                                                    bg: 'bg-purple-100',
                                                    text: 'text-purple-800',
                                                    border: 'border-purple-200',
                                                    dot: 'bg-purple-500'
                                                  };
                                                case 'delivered':
                                                  return {
                                                    bg: 'bg-green-100',
                                                    text: 'text-green-800',
                                                    border: 'border-green-200',
                                                    dot: 'bg-green-500'
                                                  };
                                                case 'return':
                                                  return {
                                                    bg: 'bg-orange-100',
                                                    text: 'text-orange-800',
                                                    border: 'border-orange-200',
                                                    dot: 'bg-orange-500'
                                                  };
                                                case 'refund in progress':
                                                  return {
                                                    bg: 'bg-indigo-100',
                                                    text: 'text-indigo-800',
                                                    border: 'border-indigo-200',
                                                    dot: 'bg-indigo-500'
                                                  };
                                                case 'refunded':
                                                  return {
                                                    bg: 'bg-gray-100',
                                                    text: 'text-gray-800',
                                                    border: 'border-gray-200',
                                                    dot: 'bg-gray-500'
                                                  };
                                                case 'cancelled':
                                                  return {
                                                    bg: 'bg-red-100',
                                                    text: 'text-red-800',
                                                    border: 'border-red-200',
                                                    dot: 'bg-red-500'
                                                  };
                                                case 'replacement':
                                                  return {
                                                    bg: 'bg-pink-100',
                                                    text: 'text-pink-800',
                                                    border: 'border-pink-200',
                                                    dot: 'bg-pink-500'
                                                  };
                                                default:
                                                  return {
                                                    bg: 'bg-gray-100',
                                                    text: 'text-gray-800',
                                                    border: 'border-gray-200',
                                                    dot: 'bg-gray-500'
                                                  };
                                              }
                                            };
                                            
                                            const statusStyles = getStatusStyles(itemStatus);
                                            
                                            return (
                                              <div key={itemId} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex justify-between items-start">
                                                  <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                      <h5 className="font-semibold text-gray-900 text-lg">{item.name || 'Unknown Item'}</h5>
                                                      <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${statusStyles.dot}`}></div>
                                                        {itemStatus}
                                                      </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">Quantity: {item.qty || item.quantity || 0}</p>
                                                    {item.image && (
                                                      <div className="mt-2">
                                                        <img 
                                                          src={item.image} 
                                                          alt={item.name || 'Product'} 
                                                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                          onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                          }}
                                                        />
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="text-right ml-4">
                                                    <p className="font-bold text-lg text-accent-rose">₹{(item.price || 0) * (item.qty || item.quantity || 0)}</p>
                                                    <p className="text-xs text-gray-500">₹{item.price || 0} each</p>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                        ) : (
                                          <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                                            <ShoppingBagIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">No items found</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="w-24 h-24 bg-gradient-to-br from-accent-rose to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBagIcon className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-500 mb-6">Start shopping to see your order history here</p>
                      <Button 
                        onClick={() => window.location.href = '/shop'} 
                        variant="primary" 
                        className="px-6 py-3"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Wishlist</h2>
                  <div className="text-center py-12">
                    <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <p className="text-gray-400 text-sm">Start adding items to your wishlist</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
                      <p className="text-gray-600 text-sm">Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Danger Zone</h3>
                      <p className="text-gray-600 text-sm mb-4">Permanently delete your account and all associated data</p>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}; 