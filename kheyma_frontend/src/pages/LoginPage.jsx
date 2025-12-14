import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="relative w-full bg-background-dark border-b border-border-dark">
        <div className="px-4 md:px-10 flex justify-center py-0">
          <div className="flex flex-col max-w-[1280px] flex-1">
            <header className="flex items-center justify-between whitespace-nowrap px-0 py-4">
              <Link to="/" className="flex items-center gap-4 text-white">
                <div className="size-8 text-primary">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      clipRule="evenodd"
                      d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Kheyma</h2>
              </Link>
              <div className="hidden md:flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                  <Link to="/campsites" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                    Explore
                  </Link>
                  <Link to="/campsites" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                    Camping Spots
                  </Link>
                  <Link to="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                    About Us
                  </Link>
                </div>
                <Link
                  to="/register"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-surface-dark border border-border-dark text-white hover:bg-border-dark transition-colors text-sm font-bold"
                >
                  <span className="truncate">Sign Up</span>
                </Link>
              </div>
            </header>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center py-5 md:py-10 px-4">
        <div className="flex flex-col max-w-[1280px] w-full flex-1">
          <div className="w-full h-full flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center h-full">
              {/* Left Column: Image */}
              <div className="w-full lg:w-1/2 h-64 lg:h-[600px] relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 order-1 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent z-10"></div>
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover transform hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage:
                      'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAINVm11Vi2W5v52Bw84geVQhqDlbt8uurtsoIbeu9ONyY-xfUW6G1JwTpHSJUPhkqBg4ui0Hi69U0WsoEUWuW8nCZHUPMpXL6ireNGYB2yaiIKExC7GDn-shTBjq6HmPBmR8tq4Dkj6UuPD8BewFeye01l_jrDeA5oEUDVDp1_uhx_hEOwmH3krQ6_Nwk3i1tHB215QFunpYlUvV313mo2w6-3oWIpl83MDZ5jtiZAF3baJkR3GWde-Xge-w2ltDEkX7iKvCVmV0I)',
                  }}
                ></div>
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-background-dark bg-primary rounded-full">
                    Editor's Pick
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-2">White Desert National Park</h3>
                  <p className="text-white/80 text-sm max-w-md">
                    Experience the magic of Farafra's chalk rock formations under a canopy of stars.
                  </p>
                </div>
              </div>

              {/* Right Column: Login Form */}
              <div className="w-full lg:w-[480px] flex flex-col justify-center gap-8 order-2 lg:order-2">
                {/* Header */}
                <div className="flex flex-col gap-2 text-left">
                  <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Welcome Back</h1>
                  <h2 className="text-text-muted text-base font-normal leading-normal">
                    Log in to manage your bookings and saved locations.
                  </h2>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium leading-normal" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-border-dark bg-surface-dark focus:border-primary h-12 md:h-14 placeholder:text-text-muted/50 px-4 text-base font-normal leading-normal transition-all"
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-white text-sm font-medium leading-normal" htmlFor="password">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-primary text-sm font-medium hover:text-white transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative flex w-full items-center rounded-lg">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-border-dark bg-surface-dark focus:border-primary h-12 md:h-14 placeholder:text-text-muted/50 px-4 pr-12 text-base font-normal leading-normal transition-all"
                        id="password"
                        placeholder="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 h-full flex items-center justify-center pr-4 text-text-muted cursor-pointer hover:text-white"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 md:h-14 bg-primary hover:bg-primary/90 transition-colors text-background-dark text-base font-bold leading-normal tracking-[0.015em] mt-2 shadow-[0_0_15px_rgba(19,236,55,0.3)] hover:shadow-[0_0_25px_rgba(19,236,55,0.5)] disabled:opacity-50"
                  >
                    <span className="truncate">{loading ? 'Logging in...' : 'Log In'}</span>
                  </button>

                  {/* Social Login */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border-dark"></div>
                    <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase font-bold tracking-wider">
                      Or continue with
                    </span>
                    <div className="flex-grow border-t border-border-dark"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 h-12 rounded-lg border border-border-dark bg-surface-dark hover:bg-border-dark text-white transition-all"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        ></path>
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        ></path>
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z"
                          fill="#FBBC05"
                        ></path>
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        ></path>
                      </svg>
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 h-12 rounded-lg border border-border-dark bg-surface-dark hover:bg-border-dark text-white transition-all"
                    >
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                      </svg>
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="flex justify-center">
                  <p className="text-text-muted text-sm font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:text-white transition-colors ml-1 font-bold">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

