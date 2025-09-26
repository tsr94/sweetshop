import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sweetService } from '../services/sweetService';
import { SweetDto } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<SweetDto[]>([]);
  const [stats, setStats] = useState({
    totalSweets: 0,
    lowStock: 0,
    totalValue: 0,
    popularCategory: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const sweetsData = await sweetService.getAllSweets();
      setSweets(sweetsData);
      
      // Calculate statistics
      const totalSweets = sweetsData.length;
      const lowStock = sweetsData.filter(sweet => sweet.quantity < 10).length;
      const totalValue = sweetsData.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
      
      // Find popular category
      const categoryCount = sweetsData.reduce((acc, sweet) => {
        acc[sweet.category] = (acc[sweet.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const popularCategory = Object.keys(categoryCount).reduce((a, b) =>
  (categoryCount[a] ?? 0) > (categoryCount[b] ?? 0) ? a : b,
  "None"
);

      setStats({
        totalSweets,
        lowStock,
        totalValue,
        popularCategory
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; subtitle: string; icon: React.ReactNode; color: string }> = 
    ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickAction: React.FC<{ title: string; description: string; icon: React.ReactNode; link: string; color: string }> = 
    ({ title, description, icon, link, color }) => (
    <Link 
      to={link}
      className={`block rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${color} group`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">{title}</h3>
          <p className="text-sm text-gray-600 group-hover:text-gray-200 transition-colors duration-300">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
              <p className="text-purple-100 text-lg">
                {user?.role === 'ADMIN' 
                  ? 'Manage your sweet empire with powerful tools and insights'
                  : 'Discover delicious sweets and manage your purchases'
                }
              </p>
            </div>
            <div className="mt-4 lg:mt-0 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm">Today is {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-1">
          <nav className="flex space-x-1">
            {['overview', 'analytics', 'recent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sweets"
            value={stats.totalSweets}
            subtitle="Available products"
            icon="🍬"
            color="border-l-4 border-purple-500"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            subtitle="Need restocking"
            icon="⚠️"
            color="border-l-4 border-orange-500"
          />
          <StatCard
            title="Inventory Value"
            value={`$${stats.totalValue.toFixed(2)}`}
            subtitle="Total worth"
            icon="💰"
            color="border-l-4 border-green-500"
          />
          <StatCard
            title="Popular Category"
            value={stats.popularCategory}
            subtitle="Most items"
            icon="🏆"
            color="border-l-4 border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickAction
                title="Browse Sweets"
                description="View all available sweets"
                icon="🍭"
                link="/sweets"
                color="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
              />
              {user?.role === 'ADMIN' ? (
                <>
                  <QuickAction
                    title="Add New Sweet"
                    description="Create a new sweet item"
                    icon="➕"
                    link="/sweets"
                    color="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  />
                  <QuickAction
                    title="Manage Inventory"
                    description="Update stock levels"
                    icon="📊"
                    link="/sweets"
                    color="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  />
                  <QuickAction
                    title="View Reports"
                    description="Sales and analytics"
                    icon="📈"
                    link="/sweets"
                    color="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                  />
                </>
              ) : (
                <>
                  <QuickAction
                    title="My Purchases"
                    description="View purchase history"
                    icon="🛒"
                    link="/sweets"
                    color="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  />
                  <QuickAction
                    title="Favorites"
                    description="Your favorite sweets"
                    icon="❤️"
                    link="/sweets"
                    color="bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
                  />
                  <QuickAction
                    title="Special Offers"
                    description="Current promotions"
                    icon="🎁"
                    link="/sweets"
                    color="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                  />
                </>
              )}
            </div>
          </div>

          {/* Recent Activity / Profile Card */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.username}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  user?.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.role}
                </span>
              </div>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium">Today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Preferences</span>
                  <span className="text-sm font-medium">Default</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition duration-300 font-medium">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Recent Sweets Preview */}
        {sweets.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Sweets</h2>
              <Link 
                to="/sweets" 
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                View all
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sweets.slice(0, 3).map((sweet) => (
                <div key={sweet.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-2xl">
                      🍫
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                        {sweet.name}
                      </h3>
                      <p className="text-sm text-gray-600">{sweet.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-bold text-purple-600">${sweet.price.toFixed(2)}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          sweet.quantity > 10 
                            ? 'bg-green-100 text-green-800'
                            : sweet.quantity > 0
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sweet.quantity} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;