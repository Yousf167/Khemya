import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, locationsAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, locations: 0, transactions: 0 });
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, locationsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        locationsAPI.getAll(),
      ]);
      // Handle different response structures
      const statsData = statsRes.data || {};
      setStats({
        users: statsData.totalUsers || statsData.users || usersRes.data?.length || 0,
        locations: statsData.totalLocations || statsData.locations || locationsRes.data?.length || 0,
        transactions: statsData.totalTransactions || statsData.transactions || 0,
      });
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setLocations(Array.isArray(locationsRes.data) ? locationsRes.data : []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">{stats.users}</p>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Total Locations</h3>
            <p className="text-3xl font-bold text-primary">{stats.locations}</p>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold text-primary">{stats.transactions}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Recent Users</h2>
            <div className="space-y-2">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex justify-between items-center">
                  <span>{user.email}</span>
                  <span className="text-sm text-text-muted dark:text-text-muted-dark">{user.type || 'USER'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Recent Locations</h2>
            <div className="space-y-2">
              {locations.slice(0, 5).map((location) => (
                <div key={location.id} className="flex justify-between items-center">
                  <span>{location.title}</span>
                  <span className="text-sm text-text-muted dark:text-text-muted-dark">{location.location || location.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

