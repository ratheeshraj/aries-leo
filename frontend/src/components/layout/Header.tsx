import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCartIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../../context/AppContext";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import logo from "../../assets/aries-leo-logo.png";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cart, wishlist } = useAppContext();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const isActivePage = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  // if scroll detected close mobile menu
  useEffect(() => {
    const handleScroll = () => {
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 safe-area-top">
      {/* Top Banner */}
      <div className="bg-accent-rose text-white text-center py-2">
        <div className="container-responsive">
          <p className="text-xs sm:text-sm font-medium truncate">
            <span className="hidden sm:inline">
              Premium women's bottoms worldwide 🌍
            </span>
            <span className="sm:hidden">Free shipping over Rs. 2000 🌍</span>
          </p>
        </div>
      </div>

      <div className="container-responsive">
        <div className="grid grid-cols-12 items-center h-16 sm:h-18 md:h-20 gap-4">
          {/* Mobile menu button */}
          <div className="md:hidden col-span-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Logo Section - Centered on mobile, left-aligned on desktop */}
          <div className="col-span-8 md:col-span-3 flex items-center justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Aries Leo Logo"
                className="h-14 w-auto md:h-16 lg:h-18 xl:h-20"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex md:col-span-6 justify-center">
            <div className="flex space-x-6 lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActivePage(item.href)
                      ? "text-accent-rose border-b-2 border-accent-rose pb-1"
                      : "text-gray-700 hover:text-accent-rose"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="col-span-2 md:col-span-3 flex items-center justify-end space-x-1 sm:space-x-2 md:space-x-3">
            {/* Search */}
            {/* <div className="relative">
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
            </div> */}

            {/* User/Login */}
            {isAuthenticated ? (
              <div className="relative group">
                <Link
                  to="/profile"
                  className="relative p-1.5 sm:p-2 text-gray-700 hover:text-accent-rose flex items-center transition-colors duration-200"
                >
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden lg:inline text-sm font-medium ml-1">
                    {user?.name || "Profile"}
                  </span>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-150"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative p-1.5 sm:p-2 text-gray-700 hover:text-accent-rose flex items-center transition-colors duration-200"
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden lg:inline text-sm font-medium ml-1">
                  Login
                </span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-accent-rose transition-colors duration-200"
            >
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-accent-rose text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs min-w-[16px] sm:min-w-[20px]">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-accent-rose transition-colors duration-200"
            >
              <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-accent-rose text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs min-w-[16px] sm:min-w-[20px]">
                  {cart.totalItems > 9 ? "9+" : cart.totalItems}
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
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-200 py-3 bg-white"
            >
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActivePage(item.href)
                        ? "text-accent-rose bg-accent-light border-l-4 border-accent-rose"
                        : "text-gray-700 hover:text-accent-rose hover:bg-accent-light hover:border-l-4 hover:border-accent-rose"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile-only user actions */}
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-1">
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-accent-rose hover:bg-accent-light transition-all duration-200"
                    >
                      Login
                    </Link>
                  )}
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-accent-rose hover:bg-accent-light transition-all duration-200"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brand tagline bar */}
      <div className="bg-gray-50 text-center py-2 sm:py-3 text-gray-600 border-t border-gray-200">
        <div className="container-responsive">
          <p className="text-xs sm:text-sm font-medium truncate">
            <span className="hidden sm:inline">
              "NOT JUST PANT - A POWER MOVE"
            </span>
            <span className="sm:hidden">"Cotton • Comfort • Confidence"</span>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
