import { X, Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-pulse-gray rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 right-0 float-right m-4 p-2 hover:bg-pulse-bg rounded-lg transition z-10"
        >
          <X className="w-6 h-6 text-pulse-text" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {/* Image */}
          <div className="bg-pulse-bg rounded-xl overflow-hidden aspect-square flex items-center justify-center">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-8" />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-pulse-text mb-2">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-pulse-gold text-pulse-gold" />
              ))}
              <span className="text-sm text-pulse-text-secondary">(124 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex gap-3 items-baseline mb-2">
                <span className="text-3xl font-black text-pulse-gold">Rs. {product.price}</span>
                <span className="text-lg line-through text-pulse-text-secondary">Rs. {Math.round(product.price * 1.4)}</span>
              </div>
              <p className="text-green-400 text-sm font-bold">In Stock • Free Shipping</p>
            </div>

            {/* Description */}
            <p className="text-pulse-text-secondary mb-6 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* CTA */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                className="group/add shimmer-on-hover relative flex-1 overflow-hidden bg-gradient-to-br from-pulse-gold-light via-pulse-gold to-pulse-gold-dark text-pulse-bg font-bold py-3 rounded-xl shadow-gold-glow ring-1 ring-pulse-gold-light/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold-glow-intense active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover/add:-translate-y-0.5 group-hover/add:-rotate-12" />
                Add to Cart
              </button>
              <button className="p-3 bg-pulse-bg border border-pulse-border hover:border-pulse-gold text-pulse-text hover:text-pulse-gold rounded-xl transition">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
