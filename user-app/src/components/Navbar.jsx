import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const Navbar = ({ onSearch, onCartOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const isActive = (path) => location.pathname === path;

  // Nav link with gold active indicator
  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative py-1 text-sm font-medium transition-colors ${
        isActive(to) ? 'text-pulse-gold' : 'text-pulse-text-secondary hover:text-pulse-text'
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-pulse-gold transition-all duration-300 ${
          isActive(to) ? 'w-full' : 'w-0'
        }`}
      />
    </Link>
  );

  const cartCount = getCartCount();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 text-pulse-text transition-all duration-300 ${
        scrolled
          ? 'bg-pulse-bg/85 backdrop-blur-xl border-b border-pulse-border shadow-card'
          : 'bg-pulse-bg/60 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="h-16 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          {/* Logo with gold pulse dot */}
          <Link to="/" className="group flex items-center gap-2 text-2xl font-black tracking-tight">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-pulse-gold opacity-70 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pulse-gold" />
            </span>
            <span className="text-pulse-text">
              Pulse<span className="text-pulse-accent group-hover:text-pulse-gold transition-colors">Bay</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2.5 pl-11 bg-pulse-gray/60 hover:bg-pulse-gray text-pulse-text rounded-xl transition-all border border-pulse-border focus:border-pulse-gold/60 focus:outline-none focus:ring-2 focus:ring-pulse-gold/25 placeholder-pulse-text-muted text-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-text-muted pointer-events-none" />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-7">
            {isAuthenticated ? (
              <>
                <NavLink to="/orders">Orders</NavLink>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'text-pulse-gold' : 'text-pulse-text-secondary hover:text-pulse-text'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="max-w-24 truncate">{user?.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-pulse-text-secondary hover:text-pulse-text transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/signup"
                  className="bg-pulse-gold hover:bg-pulse-gold-light text-pulse-bg font-bold px-5 py-2 rounded-xl transition-all hover:shadow-gold-glow active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={onCartOpen}
              className="relative p-2 rounded-xl text-pulse-text-secondary hover:text-pulse-text hover:bg-pulse-gray/60 transition-all"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pulse-gold text-pulse-bg text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold shadow-gold-glow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile cart + menu */}
          <div className="md:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={onCartOpen}
              className="relative p-2 text-pulse-text"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pulse-gold text-pulse-bg text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-pulse-bg/95 backdrop-blur-xl pb-5 border-t border-pulse-border px-4 shadow-card">
            <form onSubmit={handleSearch} className="mb-4 mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2.5 pl-11 bg-pulse-gray text-pulse-text rounded-xl border border-pulse-border focus:border-pulse-gold/60 focus:outline-none focus:ring-2 focus:ring-pulse-gold/25 text-sm"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-text-muted" />
              </div>
            </form>
            <div className="flex flex-col gap-1 text-sm">
              {isAuthenticated ? (
                <>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 rounded-lg text-pulse-text hover:bg-pulse-gray transition">Orders</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 rounded-lg text-pulse-text hover:bg-pulse-gray transition">Profile</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left py-2.5 px-2 rounded-lg text-pulse-text hover:bg-pulse-gray transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 rounded-lg text-pulse-text hover:bg-pulse-gray transition">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="mt-1 bg-pulse-gold text-pulse-bg font-bold py-3 px-2 rounded-xl text-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
