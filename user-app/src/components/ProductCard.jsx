import { ShoppingCart, Plus, Minus, Eye, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = cart.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-pulse-accent/20 bg-pulse-gray shadow-sm transition duration-300 hover:-translate-y-2 hover:border-pulse-gold/60 hover:shadow-glow hover:shadow-pulse-gold/50">
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-pulse-bg-dark p-5 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded bg-pulse-gray text-pulse-text-secondary">
            No Image
          </div>
        )}

        {/* Sale Badge */}
        <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          SALE
        </span>

        {/* Category Badge */}
        <span className="absolute right-3 top-3 rounded-full bg-pulse-gold/20 px-3 py-1 text-xs font-semibold text-pulse-gold border border-pulse-gold/50 backdrop-blur">
          {product.category}
        </span>

        {/* Quick Action Buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onQuickView?.(product)}
            className="bg-pulse-accent hover:bg-pulse-accent-dark text-pulse-bg p-3 rounded-full transition"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="bg-pulse-gold hover:bg-pulse-gold-dark text-pulse-bg p-3 rounded-full transition"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col border-t border-pulse-accent/10 p-5">
        <div className="min-h-[96px]">
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-pulse-text">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-pulse-text-secondary">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-pulse-gold text-pulse-gold" />
            ))}
          </div>
          <span className="text-xs text-pulse-text-secondary">(48)</span>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div>
            <span className="text-xl font-black text-pulse-accent">Rs. {product.price}</span>
            <br />
            <span className="text-xs line-through text-pulse-text-secondary">Rs. {Math.round(product.price * 1.4)}</span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="group/btn inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-pulse-accent hover:bg-pulse-accent-dark text-pulse-bg px-4 py-2.5 font-semibold transition duration-300 hover:shadow-glow-intense"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center overflow-hidden rounded-lg bg-pulse-accent/20 border border-pulse-accent/50">
              <button
                onClick={handleDecrement}
                className="p-2.5 text-pulse-accent transition hover:bg-pulse-accent/30"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-10 text-center font-semibold text-pulse-accent text-sm">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-2.5 text-pulse-accent transition hover:bg-pulse-accent/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
