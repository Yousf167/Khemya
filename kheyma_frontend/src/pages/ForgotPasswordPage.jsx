import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      setMessage('Error sending reset link. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && (
            <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

