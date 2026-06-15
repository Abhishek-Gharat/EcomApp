import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = ({ onSearch, onCartOpen }) => {
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
    onSearch?.(searchQuery.trim());
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value.trim());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-pulse-bg text-pulse-text border-b border-pulse-accent/40 shadow-md backdrop-blur-sm">
      <div className="h-16 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          <Link to="/" className="text-2xl font-bold text-pulse-accent">
            PulseBay
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 bg-pulse-gray/80 hover:bg-pulse-gray text-pulse-text rounded-lg transition-colors border border-pulse-accent/30 focus:border-pulse-accent focus:outline-none focus:ring-2 focus:ring-pulse-accent/50 placeholder-pulse-text-secondary"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-pulse-text-secondary pointer-events-none" />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="hover:text-pulse-accent transition">Orders</Link>
                <Link to="/profile" className="flex items-center gap-2 hover:text-pulse-accent transition">
                  <User className="w-5 h-5" />
                  <span className="max-w-24 truncate">{user?.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-pulse-accent transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-pulse-accent transition">Login</Link>
                <Link to="/signup" className="bg-pulse-accent text-pulse-bg px-4 py-2 rounded-lg hover:shadow-glow transition">
                  Sign Up
                </Link>
              </>
            )}
            <button type="button" onClick={onCartOpen} className="relative hover:text-pulse-accent transition">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pulse-accent text-pulse-bg text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-pulse-gray/95 backdrop-blur-md pb-4 border-t border-pulse-accent/40 px-4 max-w-7xl mx-auto">
            <form onSubmit={handleSearch} className="mb-4 mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 pl-10 bg-pulse-bg text-pulse-text rounded-lg border border-pulse-accent/30 focus:border-pulse-accent focus:outline-none focus:ring-1 focus:ring-pulse-accent"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-pulse-text-secondary" />
              </div>
            </form>
            <div className="flex flex-col gap-4 text-sm">
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="text-pulse-text hover:text-pulse-accent transition">Orders</Link>
                  <Link to="/profile" className="text-pulse-text hover:text-pulse-accent transition">Profile</Link>
                  <button onClick={handleLogout} className="text-left text-pulse-text hover:text-pulse-accent transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-pulse-text hover:text-pulse-accent transition">Login</Link>
                  <Link to="/signup" className="text-pulse-accent font-semibold">Sign Up</Link>
                </>
              )}
              <button type="button" onClick={onCartOpen} className="flex items-center gap-2 text-pulse-text hover:text-pulse-accent transition text-left">
                <ShoppingCart className="w-5 h-5" />
                Cart ({getCartCount()})
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
