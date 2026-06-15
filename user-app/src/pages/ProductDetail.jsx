import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShoppingCart, Star, CheckCircle, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data (replace with Firebase fetch)
  const product = {
    id: id,
    name: 'Premium Wireless Earbuds Pro',
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviews: 324,
    stock: 15,
    category: 'Audio',
    description: 'Experience crystal-clear sound with active noise cancellation. 40-hour battery life. Premium build quality.',
    features: [
      'Active Noise Cancellation',
      '40-hour battery life',
      'Premium titanium finish',
      'Wireless charging case',
      'Multi-device pairing'
    ],
    specifications: {
      'Driver Size': '10mm dynamic',
      'Frequency Response': '20Hz - 20kHz',
      'Impedance': '32 ohms',
      'Battery Life': '40 hours',
      'Warranty': '2 years'
    },
    images: [
      'https://via.placeholder.com/500x500?text=Product+1',
      'https://via.placeholder.com/500x500?text=Product+2',
      'https://via.placeholder.com/500x500?text=Product+3'
    ],
    badge: 'SALE',
    discount: '28%'
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category
    });
  };

  return (
    <div className="min-h-screen bg-pulse-bg text-pulse-text py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex gap-2 text-sm text-pulse-text-secondary">
          <button onClick={() => navigate('/')} className="hover:text-pulse-accent">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/')} className="hover:text-pulse-accent">{product.category}</button>
          <span>/</span>
          <span className="text-pulse-accent">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4 bg-pulse-gray rounded-xl overflow-hidden aspect-square">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">{product.badge}</span>
                  <span className="bg-pulse-gold text-pulse-bg px-3 py-1 rounded-full text-sm font-bold">-{product.discount}</span>
                </div>
              )}
              <img
                src={product.images[selectedImage]}
                alt="Product"
                className="w-full h-full object-contain p-8"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 z-10 bg-pulse-bg/80 backdrop-blur p-2 rounded-full hover:bg-pulse-gold hover:text-pulse-bg transition"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail images */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-pulse-gold' : 'border-pulse-gray'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-pulse-gray">
              <h1 className="text-4xl font-black text-pulse-text mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-pulse-gold text-pulse-gold' : 'text-pulse-gray'}`}
                    />
                  ))}
                </div>
                <span className="text-pulse-gold font-bold">{product.rating}</span>
                <span className="text-pulse-text-secondary">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-black text-pulse-accent">Rs. {product.price}</span>
                <span className="text-xl line-through text-pulse-text-secondary">Rs. {product.originalPrice}</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">In Stock ({product.stock} available)</span>
                  </>
                ) : (
                  <span className="text-red-400">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-pulse-text mb-3 uppercase">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-pulse-text-secondary">
                    <CheckCircle className="w-5 h-5 text-pulse-gold flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & CTA */}
            <div className="mb-6 pb-6 border-b border-pulse-gray">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-pulse-text-secondary">Quantity:</span>
                <div className="flex items-center bg-pulse-gray rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-pulse-accent hover:bg-pulse-gray-light"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-pulse-accent hover:bg-pulse-gray-light"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-pulse-accent hover:shadow-glow-intense text-pulse-bg font-bold py-4 rounded-lg transition"
                >
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  ADD TO CART
                </button>
                <button className="px-6 py-4 bg-pulse-gold hover:bg-pulse-gold-dark text-pulse-bg font-bold rounded-lg transition">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-pulse-gray rounded-lg p-4 text-center">
                <Truck className="w-6 h-6 text-pulse-gold mx-auto mb-2" />
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-pulse-text-secondary">On orders above Rs.500</p>
              </div>
              <div className="bg-pulse-gray rounded-lg p-4 text-center">
                <RotateCcw className="w-6 h-6 text-pulse-gold mx-auto mb-2" />
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-xs text-pulse-text-secondary">30-day return policy</p>
              </div>
              <div className="bg-pulse-gray rounded-lg p-4 text-center">
                <Shield className="w-6 h-6 text-pulse-gold mx-auto mb-2" />
                <p className="text-sm font-semibold">Secure Payment</p>
                <p className="text-xs text-pulse-text-secondary">100% safe transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16 bg-pulse-gray rounded-xl p-8">
          <h3 className="text-2xl font-black text-pulse-text mb-6 uppercase">Technical Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key}>
                <p className="text-pulse-text-secondary text-sm mb-1">{key}</p>
                <p className="text-pulse-text font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-black text-pulse-text mb-8 uppercase">Customer Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { author: 'Ahmed K.', rating: 5, text: 'Best product ever. Worth every penny!' },
              { author: 'Fatima S.', rating: 4, text: 'Great quality. Delivery was fast.' },
              { author: 'Hassan M.', rating: 5, text: 'Exactly as described. Highly recommend!' }
            ].map((review, idx) => (
              <div key={idx} className="bg-pulse-gray rounded-lg p-6 border border-pulse-accent/20">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-pulse-gold text-pulse-gold' : 'text-pulse-gray'}`} />
                  ))}
                </div>
                <p className="text-pulse-text mb-3">"{review.text}"</p>
                <p className="text-pulse-text-secondary text-sm">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
