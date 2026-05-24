import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = ({ onSearch }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <nav className="bg-boat-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-boat-red">
            boAt
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-boat-dark text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-boat-red"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="hover:text-boat-red transition">Orders</Link>
                <Link to="/profile" className="flex items-center gap-2 hover:text-boat-red transition">
                  <User className="w-5 h-5" />
                  <span className="max-w-24 truncate">{user?.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-boat-red transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-boat-red transition">Login</Link>
                <Link to="/signup" className="bg-boat-red px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  Sign Up
                </Link>
              </>
            )}
            <Link to="/cart" className="relative hover:text-boat-red transition">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-boat-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-boat-dark text-white rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </form>
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="hover:text-boat-red">Orders</Link>
                  <Link to="/profile" className="hover:text-boat-red">Profile</Link>
                  <button onClick={handleLogout} className="text-left hover:text-boat-red">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-boat-red">Login</Link>
                  <Link to="/signup" className="text-boat-red">Sign Up</Link>
                </>
              )}
              <Link to="/cart" className="flex items-center gap-2 hover:text-boat-red">
                <ShoppingCart className="w-5 h-5" />
                Cart ({getCartCount()})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
