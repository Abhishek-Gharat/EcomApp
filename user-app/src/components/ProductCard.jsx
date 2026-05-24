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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
      <div className="relative h-48 bg-gray-100">
        {!imageError ? (
          <img
            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
        <span className="absolute top-2 left-2 bg-boat-black text-white text-xs px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-boat-black mb-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-boat-red">₹{product.price}</span>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-boat-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-boat-red rounded-lg">
              <button
                onClick={handleDecrement}
                className="p-2 text-white hover:bg-red-600 rounded-l-lg transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-semibold min-w-[24px] text-center">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-2 text-white hover:bg-red-600 rounded-r-lg transition"
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
