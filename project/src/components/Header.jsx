import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
const Header = () => {
  const user=useSelector(selectLoggedInUser)
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuopen, setIsMenuopen] = useState(false);
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Shop" },
    { path: "/cart", label: "Cart" },
    { path: "/orders", label: "Orders" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsMenuopen(!isMenuopen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              {isMenuopen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link
              to="/"
              className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              ShopHub
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:space-x-4">
            {/* Search Icon */}
            <button className="p-2 hidden sm:block text-gray-400 hover:text-gray-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 text-gray-400 hover:text-gray-500 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {!user ? (
              <div className="block ">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className=" p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="flex">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 448 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                    </svg>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 320 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
                    </svg>
                  </div>
                </button>
                {isMenuOpen && (
                  <div className=" h-36 animate-slide-up absolute right-[30px] dropdown bg-[#262626] text-[#767676] p-4 flex flex-col gap-2  top-[55px]  w-32 z-10">
                    <NavLink
                      to="/register"
                      className="text-gray-400 hover:text-white hover:cursor-pointer hover:border-b-white w-full h-[30px] mb-[2px] border-b-[1px] text-sm border-b-gray-400"
                    >
                      Sign up
                    </NavLink>

                    <NavLink
                      to="/login"
                      className="text-gray-400 hover:text-white hover:cursor-pointer hover:border-b-white w-full h-[30px] mb-[2px] border-b-[1px] text-sm border-b-gray-400"
                    >
                      Log in
                    </NavLink>
                    <NavLink
                      to="/"
                      className="text-gray-400 hover:text-white hover:cursor-pointer hover:border-b-white w-full h-[30px] mb-[2px] border-b-[1px] text-sm border-b-gray-400"
                    >
                      Others
                    </NavLink>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <NavLink
                  to="/account"
                  className="w-7 flex justify-center items-center h-7 rounded-full border-2 text-gray-500 text-center text-xl  border-gray-500  "
                >
                  <User />
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuopen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(link.path)
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
