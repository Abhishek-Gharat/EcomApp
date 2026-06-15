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
import SectionHeader from '../components/Common/SectionHeader';
import Reveal from '../components/Common/Reveal';
import CountUp from '../components/Common/CountUp';
import { Loader2, Zap, Target, Rocket } from 'lucide-react';

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

      {/* Social proof stats bar */}
      <div className="border-y border-pulse-border bg-pulse-bg-dark">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 10, suffix: 'K+', label: 'Happy Customers' },
            { value: 500, suffix: '+', label: 'Products' },
            { value: 98, suffix: '%', label: 'Satisfaction' },
            { value: 24, suffix: '/7', label: 'Support' },
          ].map((stat, idx) => (
            <Reveal key={stat.label} delay={idx * 0.1} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-pulse-gold">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider text-pulse-text-muted mt-1">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-pulse-bg-dark py-24" data-section="products">
        <div className="max-w-7xl mx-auto px-4">
          {/* Featured Products */}
          <div className="mb-24">
            <SectionHeader
              eyebrow="Featured"
              title="Load Up"
              subtitle="Hand-picked gear, ready to ship. Premium quality at fair prices."
            />

            {error && (
              <div className="mb-8 p-4 rounded-xl bg-red-900/20 border border-red-500/30">
                <p className="text-red-400 mb-3">{error}</p>
                <button
                  onClick={fetchData}
                  className="bg-pulse-gold text-pulse-bg px-4 py-2 rounded-lg font-semibold hover:bg-pulse-gold-light transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-pulse-gray rounded-2xl border border-pulse-border">
                <p className="text-pulse-text-secondary text-lg">No products found.</p>
                {searchQuery && (
                  <p className="text-pulse-text-muted mt-2 text-sm">Try adjusting your search or filters.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                  <Reveal key={product.id} delay={Math.min(idx * 0.05, 0.3)}>
                    <ProductCard
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  </Reveal>
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
          <div className="mb-24">
            <SectionHeader
              eyebrow="Browse"
              title="Find Your Weapon"
              subtitle="Filter by category to zero in on exactly what you need."
            />
            <Reveal className="rounded-2xl bg-pulse-gray/50 p-5 border border-pulse-border">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </Reveal>
          </div>

          {/* Why PulseBay Section */}
          <div className="mb-4">
            <SectionHeader eyebrow="Why PulseBay" title="Built Different" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { Icon: Zap, title: 'Charged', desc: 'Tech that empowers movement. Nothing less.' },
                { Icon: Target, title: 'Focused', desc: 'Curated gear for people who actually use it.' },
                { Icon: Rocket, title: 'Fast', desc: 'Quick shipping. Faster support. Always on.' }
              ].map((item, idx) => (
                <Reveal key={item.title} delay={idx * 0.1}>
                  <div className="group h-full bg-pulse-gray rounded-2xl p-7 border border-pulse-border transition-all duration-300 hover:-translate-y-1.5 hover:border-pulse-gold/50 hover:shadow-card-hover">
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-pulse-gold/15 text-pulse-gold transition-colors group-hover:bg-pulse-gold group-hover:text-pulse-bg">
                      <item.Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 uppercase text-pulse-text">{item.title}</h3>
                    <p className="text-pulse-text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
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
