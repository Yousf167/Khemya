import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { transactionsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  const bookingData = location.state || {};

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionData = {
        locationId: id || bookingData.campsite?.id,
        packageType: bookingData.package?.name || 'BASIC',
        amount: bookingData.package?.price || bookingData.campsite?.price,
        startDate: bookingData.checkIn,
        endDate: bookingData.checkOut,
        paymentMethod,
      };

      const response = await transactionsAPI.create(transactionData);
      navigate(`/profile?booking=${response.data.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111812] dark:text-white font-display antialiased min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-[#618968] dark:text-gray-400 mb-2 font-medium">
            <a href="/" className="hover:underline">
              Home
            </a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#111812] dark:text-white">Complete Reservation</span>
          </div>
          <h1 className="text-[#111812] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
            Complete your reservation
          </h1>
          <p className="text-[#618968] dark:text-primary/80 text-base font-semibold leading-normal flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">lock</span>
            Step 2 of 3 · Secure Checkout
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {['CARD', 'PAYPAL', 'INSTAPAY'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${
                      paymentMethod === method ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <span className="font-medium">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Guest Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue={user?.phone || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-surface-dark border border-gray-200 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">
                    EGP {bookingData.package?.price || bookingData.campsite?.price} x 3 nights
                  </span>
                  <span>EGP {(bookingData.package?.price || bookingData.campsite?.price || 0) * 3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Service fee</span>
                  <span>EGP 450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Cleaning fee</span>
                  <span>EGP 200</span>
                </div>
              </div>
              <div className="border-t border-gray-200 my-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  EGP{' '}
                  {(bookingData.package?.price || bookingData.campsite?.price || 0) * 3 + 450 + 200}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-lg transition-colors mt-4 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Booking'}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;

