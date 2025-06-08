import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCartIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartItemCount, wishlist } = useApp();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActivePage = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop with search query
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 safe-area-top">
      {/* Top Banner */}
      <div className="bg-accent-rose text-white text-center py-2 px-4">
        <p className="text-xs sm:text-sm font-medium truncate">
          <span className="hidden sm:inline">Free shipping on orders over $100 | Premium women's bottoms worldwide 🌍</span>
          <span className="sm:hidden">Free shipping over $100 🌍</span>
        </p>
      </div>

      <div className="container-responsive">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex-1 sm:flex-none text-center sm:text-left">
            <Link to="/" className="flex items-center justify-center sm:justify-start">
              <div className="text-lg sm:text-xl md:text-2xl font-display font-bold text-gray-900">
                Aries Leo
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActivePage(item.href)
                    ? 'text-accent-rose border-b-2 border-accent-rose pb-1'
                    : 'text-gray-700 hover:text-accent-rose'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 sm:p-2"
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-4 z-50"
                  >
                    <form onSubmit={handleSearch}>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Search for women's bottoms..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-rose"
                          autoFocus
                        />
                        <Button type="submit" size="sm" className="px-3 py-2 text-sm">
                          Search
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login */}
            <Link to="/login" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-accent-rose flex items-center">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" />
              <span className="hidden md:inline text-sm font-medium">Login</span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-accent-rose">
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-accent-rose text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-xs">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-accent-rose">
              <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-accent-rose text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-xs">
                  {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActivePage(item.href)
                        ? 'text-accent-rose bg-accent-light'
                        : 'text-gray-700 hover:text-accent-rose hover:bg-accent-light'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brand tagline bar */}
      <div className="bg-gray-50 text-center py-2 sm:py-3 px-4 text-gray-600 border-t border-gray-200">
        <p className="text-xs sm:text-sm font-medium truncate">
          <span className="hidden sm:inline">"Bottoms that empower – Cotton | Comfort | Confidence for Every Woman."</span>
          <span className="sm:hidden">"Cotton • Comfort • Confidence"</span>
        </p>
      </div>
    </header>
  );
};

export default Header;