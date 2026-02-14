import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table2,
  Utensils,
  ShoppingBag,
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { dataStore } from '@/services/dataStore';
import type { Order, Reservation, Table } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalReservations: 0,
    totalMenuItems: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);

  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [orders, reservations, menuItems, allTables] = await Promise.all([
        dataStore.getOrders(),
        dataStore.getReservations(),
        dataStore.getMenuItems(),
        dataStore.getTables()
      ]);

      setTables(allTables);

      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => o.createdAt.startsWith(today));

      setStats({
        totalOrders: orders.length,
        totalReservations: reservations.length,
        totalMenuItems: menuItems.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      });

      setRecentOrders(orders.slice(-5).reverse());
      setUpcomingReservations(
        reservations
          .filter(r => r.date >= today && r.status === 'confirmed')
          .slice(0, 5)
      );
    };

    fetchData();
  }, []);

  const getTableNumber = (tableId: string) => {
    return tables.find(t => t.id === tableId)?.tableNumber || 'N/A';
  };


  const statCards = [
    {
      title: 'Today\'s Orders',
      value: stats.todayOrders,
      icon: <ShoppingBag className="h-6 w-6 text-blue-500" />,
      link: '/orders'
    },
    {
      title: 'Today\'s Revenue',
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      link: '/orders'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
      link: '/orders'
    },
    {
      title: 'Active Reservations',
      value: stats.totalReservations,
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      link: '/reservations'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Tables',
      description: 'View and manage table status',
      icon: <Table2 className="h-5 w-5" />,
      link: '/tables',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Menu',
      description: 'Add, edit, or remove menu items',
      icon: <Utensils className="h-5 w-5" />,
      link: '/menu',
      color: 'bg-orange-500'
    },
    {
      title: 'View Orders',
      description: 'Track and manage customer orders',
      icon: <ShoppingBag className="h-5 w-5" />,
      link: '/orders',
      color: 'bg-green-500'
    },
    {
      title: 'Reservations',
      description: 'Manage table reservations',
      icon: <Calendar className="h-5 w-5" />,
      link: '/reservations',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Detailed overview of your restaurant's performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
            <Card key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/60 backdrop-blur-xl shadow-lg hover:-translate-y-1"
              onClick={() => navigate(stat.link)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white shadow-md hover:-translate-y-1 group overflow-hidden"
              onClick={() => navigate(action.link)}
            >
              <CardContent className="p-6 relative">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${action.color.replace('bg-', 'from-')}/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="hover:bg-orange-50 hover:text-orange-600 transition-colors">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order, i) => (
                    <div key={order.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
                            Table {order.tableNumber}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600 text-lg">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs font-medium text-gray-500 capitalize px-2 py-1 bg-gray-50 rounded-lg inline-block mt-1">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <ShoppingBag className="h-12 w-12 mb-3 opacity-20" />
                  <p>No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Reservations */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-bold">Upcoming Reservations</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/reservations')} className="hover:bg-orange-50 hover:text-orange-600 transition-colors">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingReservations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation, i) => (
                    <div key={reservation.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl">
                          <span className="text-xs font-bold uppercase">{new Date(reservation.date).toLocaleDateString([], { month: 'short' })}</span>
                          <span className="text-lg font-bold">{new Date(reservation.date).getDate()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{reservation.time}</p>
                          <p className="text-sm text-gray-500">{reservation.guests} guests • Table {getTableNumber(reservation.tableId)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Calendar className="h-12 w-12 mb-3 opacity-20" />
                  <p>No upcoming reservations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
