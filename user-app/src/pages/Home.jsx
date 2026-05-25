import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/firebaseRest';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { Loader2, Sparkles } from 'lucide-react';


const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredProducts = products.filter(product => {
    const productName = product.name?.toLowerCase() || '';
    const productDescription = product.description?.toLowerCase() || '';
    const matchesSearch = !normalizedSearch ||
                         productName.includes(normalizedSearch) ||
                         productDescription.includes(normalizedSearch);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-boat-red" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-boat-red text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-boat-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-cyan-100 mb-5">
            <Sparkles className="w-4 h-4" />
            Fresh tech picks
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            PulseBay Gear
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Shop audio, wearables, and everyday accessories from products managed in Firebase.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-9">
        <div className="mb-8 rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
            <p className="text-gray-500 text-lg">No products found.</p>
            {searchQuery && (
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
