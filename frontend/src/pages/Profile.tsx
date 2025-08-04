import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CogIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useScrollToTop } from '../hooks/useScrollToTop';
import useAuth from '../hooks/useAuth';
import logo from '../assets/aries-leo-logo.png';

export const Profile: React.FC = () => {
  useScrollToTop();
  
  const { user, isAuthenticated, getProfile, updateProfile, addAddress, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
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

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        await getProfile();
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getProfile]);

  // Update form data when user data is loaded
  useEffect(() => {
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
  }, [user]);

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
    
    // Validate passwords if changing
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileError('New passwords do not match');
      return;
    }

    try {
      const updateData: any = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      };

      if (profileForm.newPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      const success = await updateProfile(updateData);
      
      if (success) {
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
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode) {
      setAddressError('Please fill in all required fields');
      return;
    }

    try {
      const success = await addAddress(addressForm);
      
      if (success) {
        setAddressSuccess('Address added successfully!');
        // Clear form
        setAddressForm({
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
        });
      } else {
        setAddressError('Failed to add address. Please try again.');
      }
    } catch (error: any) {
      setAddressError(error.message || 'An error occurred while adding address');
    }
  };

  // Handle address removal
  const handleRemoveAddress = async (index: number) => {
    try {
      const updatedAddresses = user.addresses.filter((_: any, i: number) => i !== index);
      const success = await updateProfile({ addresses: updatedAddresses });
      
      if (success) {
        setAddressSuccess('Address removed successfully!');
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
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-rose focus:ring-offset-2 rounded-lg p-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Aries Leo Logo" className="h-16 w-auto mx-auto mb-4" />
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
              
              <button
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
              </button>
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
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  {profileSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">{profileSuccess}</p>
                    </div>
                  )}
                  
                  {profileError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{profileError}</p>
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
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

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      
                      <Input
                        label="Current Password"
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={handleProfileInputChange('currentPassword')}
                        placeholder="Enter current password"
                      />
                      
                      <Input
                        label="New Password"
                        type="password"
                        value={profileForm.newPassword}
                        onChange={handleProfileInputChange('newPassword')}
                        placeholder="Enter new password"
                      />
                      
                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={handleProfileInputChange('confirmPassword')}
                        placeholder="Confirm new password"
                      />
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
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Addresses</h3>
                      <div className="space-y-4">
                        {user.addresses.map((address: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">{address.street}</p>
                                <p className="text-gray-600">
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p className="text-gray-600">{address.country}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveAddress(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
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
                  <div className="text-center py-12">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <p className="text-gray-400 text-sm">Start shopping to see your order history here</p>
                  </div>
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