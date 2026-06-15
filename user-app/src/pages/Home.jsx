import { useState, useEffect, useRef, useMemo } from 'react';
import { getProducts, getCategories } from '../services/firebaseRest';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import ProductQuickView from '../components/ProductQuickView';
import SearchResults from '../components/SearchResults';
import Hero from '../components/Hero';
import TestimonialsCarousel from '../components/Testimonials/TestimonialsCarousel';
import NewsletterSignup from '../components/Newsletter/NewsletterSignup';
import FinalCTA from '../components/CTA/FinalCTA';
import { Loader2, Star } from 'lucide-react';

const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const searchResultsRef = useRef(null);
  const isSearchMode = useMemo(() => searchQuery.trim().length > 0, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Smooth scroll to results when search is active
  useEffect(() => {
    if (isSearchMode && searchResultsRef.current) {
      setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isSearchMode, searchQuery]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  // Memoize filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productName = product.name?.toLowerCase() || '';
      const productDescription = product.description?.toLowerCase() || '';
      const matchesSearch = !normalizedSearch ||
                           productName.includes(normalizedSearch) ||
                           productDescription.includes(normalizedSearch);
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, normalizedSearch, selectedCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-pulse-bg">
        <Loader2 className="w-12 h-12 animate-spin text-pulse-accent" />
      </div>
    );
  }

  // Handle clear search
  const handleClearSearch = () => {
    // This will be called from search results, but search query is managed by parent
    // For now, this serves as a callback
    window.history.pushState(null, '', '/');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    // Trigger search with the suggestion
    const event = new CustomEvent('searchSuggestion', { detail: { query: suggestion } });
    window.dispatchEvent(event);
  };

  // SEARCH MODE: Show only search results
  if (isSearchMode) {
    return (
      <SearchResults
        ref={searchResultsRef}
        searchQuery={searchQuery}
        filteredProducts={filteredProducts}
        onClear={handleClearSearch}
        onQuickView={setQuickViewProduct}
        onSuggestionClick={handleSuggestionClick}
      >
        {/* Quick View Modal */}
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </SearchResults>
    );
  }

  // NORMAL MODE: Show full homepage
  return (
    <div className="min-h-screen bg-pulse-bg">
      {/* Hero Section */}
      <Hero />

      {/* Products Section */}
      <div className="bg-pulse-bg-dark py-20" data-section="products">
        <div className="max-w-7xl mx-auto px-4">
          {/* Featured Products */}
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-pulse-text mb-4 uppercase tracking-tight">
              LOAD UP
            </h2>
            <p className="text-pulse-text-secondary text-lg mb-10">Featured gear. Ready to ship.</p>

            {error && (
              <div className="mb-8 p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                <p className="text-red-400 mb-3">{error}</p>
                <button
                  onClick={fetchData}
                  className="bg-pulse-accent text-pulse-bg px-4 py-2 rounded-lg font-semibold hover:bg-pulse-accent-dark transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-pulse-gray rounded-lg border border-pulse-accent/20">
                <p className="text-pulse-text-secondary text-lg">No products found.</p>
                {searchQuery && (
                  <p className="text-pulse-text-secondary mt-2 text-sm">Try adjusting your search or filters.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}

          {/* Product Quick View Modal */}
          <ProductQuickView
            product={quickViewProduct}
            isOpen={!!quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
          </div>

          {/* Category Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-pulse-text mb-8 uppercase">
              FIND YOUR WEAPON
            </h2>
            <div className="mb-8 rounded-lg bg-pulse-gray/50 p-4 border border-pulse-accent/20">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>

          {/* Why PulseBay Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-pulse-text mb-12 uppercase">
              WHY US
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '⚡', title: 'Charged', desc: 'Tech that empowers movement. Nothing less.', color: 'cyan' },
                { icon: '🎯', title: 'Focused', desc: 'Curated gear for people who actually use it.', color: 'gold' },
                { icon: '🚀', title: 'Fast', desc: 'Quick shipping. Faster support. Always on.', color: 'cyan' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-pulse-gray rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                    item.color === 'gold'
                      ? 'border-pulse-gold/20 hover:border-pulse-gold/60 hover:shadow-lg hover:shadow-pulse-gold/20'
                      : 'border-pulse-accent/20 hover:border-pulse-accent/60 hover:shadow-glow'
                  }`}
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 uppercase ${item.color === 'gold' ? 'text-pulse-gold' : 'text-pulse-accent'}`}>
                    {item.title}
                  </h3>
                  <p className="text-pulse-text-secondary text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TestimonialsCarousel - PEOPLE WHO MOVE Section */}
      <TestimonialsCarousel />

      {/* NewsletterSignup - GET EXCLUSIVE DEALS Section */}
      <NewsletterSignup />

      {/* Final CTA - READY TO UNLOCK MORE Section */}
      <FinalCTA />

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Home;
