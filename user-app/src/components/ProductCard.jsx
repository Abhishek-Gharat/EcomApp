import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);
  
  const cartItem = cart.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncrement = () => {
    addToCart(product);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] bg-white p-5">
        {!imageError ? (
          <img
            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded bg-slate-100 text-slate-400">
            No Image
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-boat-black px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          {product.category}
        </span>
      </div>
      
      <div className="flex flex-1 flex-col border-t border-slate-100 p-5">
        <div className="min-h-[96px]">
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-boat-black">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>
        
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-xl font-bold text-boat-red">Rs. {product.price}</span>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-boat-red px-4 py-2.5 font-semibold text-white transition hover:bg-teal-700"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center overflow-hidden rounded-lg bg-boat-red">
              <button
                onClick={handleDecrement}
                className="p-2.5 text-white transition hover:bg-teal-700"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-10 text-center font-semibold text-white">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-2.5 text-white transition hover:bg-teal-700"
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
