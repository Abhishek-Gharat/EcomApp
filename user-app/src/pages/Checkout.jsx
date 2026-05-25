import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/firebaseRest';
import { MapPin, CreditCard, Package, Loader2, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { user, userData, isAuthenticated } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (cart.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [isAuthenticated, cart, navigate, orderPlaced]);

  const handlePlaceOrder = async () => {
    const address = useNewAddress ? newAddress : selectedAddress;
    
    if (!address) {
      setError('Please select or enter a delivery address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderData = {
        userId: user.localId,
        userEmail: user.email,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: getCartTotal(),
        address: address,
        status: 'processing',
        paymentMethod: 'COD'
      };

      await placeOrder(orderData, user.idToken);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-boat-black mb-4">Order Placed!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your order. We'll deliver your items soon!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-boat-red text-white py-3 rounded-lg font-semibold hover:bg-red-600"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-boat-black mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h2>

              {userData?.addresses?.length > 0 && !useNewAddress && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Select from saved addresses:</p>
                  {userData.addresses.map((address, index) => (
                    <label
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedAddress === address
                          ? 'border-boat-red bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address}
                        checked={selectedAddress === address}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1"
                      />
                      <span className="flex-1">{address}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="border-t pt-4">
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useNewAddress}
                    onChange={(e) => {
                      setUseNewAddress(e.target.checked);
                      if (!e.target.checked) setNewAddress('');
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Use a new address</span>
                </label>

                {useNewAddress && (
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boat-red focus:border-transparent"
                    rows="3"
                    placeholder="Enter your delivery address..."
                  />
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-boat-red rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">COD</span>
                  </div>
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-boat-red">Rs. {getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 bg-boat-red text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Place Order (COD)'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
