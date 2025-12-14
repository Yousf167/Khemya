import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { transactionsAPI } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await transactionsAPI.getUserTransactions();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-surface-border rounded-lg bg-white dark:bg-surface-dark"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    defaultValue={user.dob}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-surface-border rounded-lg bg-white dark:bg-surface-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    defaultValue={user.address}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-surface-border rounded-lg bg-white dark:bg-surface-dark"
                  />
                </div>
                <button className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-primary/90">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">My Bookings</h2>
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border-b border-gray-200 pb-4">
                      <p className="font-medium">{booking.locationId}</p>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">{booking.startDate} - {booking.endDate}</p>
                </div>
              ))
            ) : (
              <p className="text-text-muted dark:text-text-muted-dark">No bookings yet</p>
            )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;

