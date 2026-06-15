import { ShoppingCart, Plus, Minus, Eye, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = cart.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;
  const oldPrice = Math.round(product.price * 1.4);
  const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100);

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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-pulse-border bg-pulse-gray shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pulse-gold/50 hover:shadow-card-hover">
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-pulse-bg-dark p-5 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded bg-pulse-gray text-pulse-text-muted">
            No Image
          </div>
        )}

        {/* Discount Badge (gold = deal) */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-pulse-gold px-2.5 py-1 text-xs font-bold text-pulse-bg shadow-gold-glow">
            -{discount}%
          </span>
        )}

        {/* Category Badge */}
        <span className="absolute right-3 top-3 rounded-full bg-pulse-bg/70 px-3 py-1 text-xs font-semibold text-pulse-text-secondary border border-pulse-border backdrop-blur">
          {product.category}
        </span>

        {/* Quick Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-gradient-to-t from-pulse-bg-dark/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            onClick={() => onQuickView?.(product)}
            aria-label="Quick view"
            className="translate-y-2 rounded-full bg-pulse-text p-3 text-pulse-bg transition duration-300 hover:bg-pulse-gold group-hover:translate-y-0"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Add to favorites"
            className={`translate-y-2 rounded-full p-3 transition duration-300 group-hover:translate-y-0 ${
              isFavorite ? 'bg-pulse-gold text-pulse-bg' : 'bg-pulse-text text-pulse-bg hover:bg-pulse-gold'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col border-t border-pulse-border/60 p-5">
        <div className="min-h-[88px]">
          <h3 className="mb-1.5 line-clamp-1 text-lg font-bold text-pulse-text transition-colors group-hover:text-pulse-gold">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-pulse-text-secondary">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 my-2.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-pulse-gold text-pulse-gold" />
            ))}
          </div>
          <span className="text-xs text-pulse-text-muted">4.9 (48)</span>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="leading-tight">
            <span className="text-2xl font-black text-pulse-gold">Rs. {product.price}</span>
            <div className="text-xs line-through text-pulse-text-muted">Rs. {oldPrice}</div>
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="group/add shimmer-on-hover relative inline-flex min-w-24 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-pulse-gold-light via-pulse-gold to-pulse-gold-dark px-5 py-2.5 font-bold text-pulse-bg shadow-gold-glow ring-1 ring-pulse-gold-light/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold-glow-intense active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover/add:-translate-y-0.5 group-hover/add:-rotate-12" />
              <span className="tracking-wide">Add</span>
            </button>
          ) : (
            <div className="flex items-center overflow-hidden rounded-xl bg-pulse-gold/15 border border-pulse-gold/50">
              <button
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="p-2.5 text-pulse-gold transition hover:bg-pulse-gold/25"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-10 text-center font-bold text-pulse-gold text-sm">{quantity}</span>
              <button
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="p-2.5 text-pulse-gold transition hover:bg-pulse-gold/25"
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
