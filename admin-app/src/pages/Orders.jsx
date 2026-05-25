import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders, updateOrderStatus } from '../services/firebaseRest';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const Orders = () => {
  const { idToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [idToken]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(idToken);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await updateOrderStatus(orderId, newStatus, idToken);
      await fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track customer orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{order.id?.slice(-8)}</td>
                      <td className="px-6 py-4">{order.userEmail}</td>
                      <td className="px-6 py-4">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 font-semibold">Rs. {order.total?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingStatus === order.id}
                          className={`px-3 py-1 rounded-lg text-sm font-medium border cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        {updatingStatus === order.id && (
                          <Loader2 className="w-4 h-4 animate-spin inline ml-2" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50 border-t">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                    <img
                                      src={item.image || 'https://via.placeholder.com/50'}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{item.name}</p>
                                      <p className="text-gray-600 text-sm">
                                        Qty: {item.quantity} x Rs. {item.price}
                                      </p>
                                    </div>
                                    <p className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">Delivery Details</h4>
                              <div className="bg-white p-4 rounded-lg space-y-2">
                                <p><span className="text-gray-600">Address:</span> {order.address}</p>
                                <p><span className="text-gray-600">Payment:</span> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
                                <p><span className="text-gray-600">Order Date:</span> {new Date(order.createdAt).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
