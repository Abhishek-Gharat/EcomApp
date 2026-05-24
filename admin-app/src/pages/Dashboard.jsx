import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, getOrders, getCategories } from '../services/firebaseRest';
import { Package, ShoppingCart, Tag, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user, idToken } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, [idToken]);

  const fetchData = async () => {
    try {
      const [products, orders, categories] = await Promise.all([
        getProducts(idToken),
        getOrders(idToken),
        getCategories(idToken)
      ]);

      const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        products: products.length,
        orders: orders.length,
        categories: categories.length,
        revenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'bg-purple-500' },
    { label: 'Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-4 text-sm font-medium text-gray-600">Order ID</th>
                    <th className="pb-4 text-sm font-medium text-gray-600">Customer</th>
                    <th className="pb-4 text-sm font-medium text-gray-600">Total</th>
                    <th className="pb-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-4 text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-4 font-mono text-sm">{order.id?.slice(-8)}</td>
                      <td className="py-4">{order.userEmail}</td>
                      <td className="py-4 font-semibold">₹{order.total?.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
