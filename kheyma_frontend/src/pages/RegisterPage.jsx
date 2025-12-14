import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    // Backend doesn't have name field, but we'll pass it for local storage
    const result = await register(formData.email, formData.password, formData.name);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#28392b] bg-white/90 dark:bg-[#111812]/90 backdrop-blur-md px-6 lg:px-10 py-3">
        <Link to="/" className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Kheyma</h2>
        </Link>
        <div className="flex flex-1 justify-end gap-6 md:gap-8">
          <div className="hidden md:flex items-center gap-6 lg:gap-9">
            <Link to="/" className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/campsites" className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors">
              Explore
            </Link>
            <Link to="/login" className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors">
              Log In
            </Link>
          </div>
          <Link
            to="/login"
            className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-slate-900 text-sm font-bold hover:bg-green-400 transition-colors"
          >
            <span className="truncate">Log In</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-6 sm:px-12 md:px-10 lg:px-20 py-10 md:py-0 bg-white dark:bg-background-dark z-10">
          <div className="max-w-[480px] w-full mx-auto space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">
                Create your account
              </h1>
              <p className="text-slate-500 dark:text-text-muted text-sm font-normal leading-relaxed">
                Join Egypt's largest community of campers and explorers. Discover hidden gems under the stars.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <label className="flex flex-col w-full">
                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal pb-2">Name</p>
                <input
                  className="form-input w-full rounded-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-input-bg border border-slate-200 dark:border-transparent focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-text-muted/60 text-base font-normal transition-all duration-200"
                  placeholder="Enter your name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="flex flex-col w-full">
                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal pb-2">Email Address</p>
                <input
                  className="form-input w-full rounded-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-input-bg border border-slate-200 dark:border-transparent focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-text-muted/60 text-base font-normal transition-all duration-200"
                  placeholder="you@example.com"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="flex flex-col w-full relative group">
                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal pb-2">Password</p>
                <div className="relative">
                  <input
                    className="form-input w-full rounded-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-input-bg border border-slate-200 dark:border-transparent focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 pr-12 placeholder:text-slate-400 dark:placeholder:text-text-muted/60 text-base font-normal transition-all duration-200"
                    placeholder="Create a password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-slate-400 dark:text-text-muted cursor-pointer hover:text-slate-600 dark:hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </label>

              <label className="flex flex-col w-full relative group">
                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal pb-2">Confirm Password</p>
                <input
                  className="form-input w-full rounded-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-input-bg border border-slate-200 dark:border-transparent focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-text-muted/60 text-base font-normal transition-all duration-200"
                  placeholder="Confirm your password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 md:h-14 bg-primary hover:bg-primary/90 transition-colors text-background-dark text-base font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(19,236,55,0.3)] hover:shadow-[0_0_25px_rgba(19,236,55,0.5)] disabled:opacity-50"
              >
                <span className="truncate">{loading ? 'Creating account...' : 'Create Account'}</span>
              </button>
            </form>

            <div className="flex justify-center">
              <p className="text-slate-500 dark:text-text-muted text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-white transition-colors ml-1 font-bold">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-full md:w-1/2 lg:w-[55%] xl:w-[60%] bg-gradient-to-br from-primary/20 to-background-dark relative overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAINVm11Vi2W5v52Bw84geVQhqDlbt8uurtsoIbeu9ONyY-xfUW6G1JwTpHSJUPhkqBg4ui0Hi69U0WsoEUWuW8nCZHUPMpXL6ireNGYB2yaiIKExC7GDn-shTBjq6HmPBmR8tq4Dkj6UuPD8BewFeye01l_jrDeA5oEUDVDp1_uhx_hEOwmH3krQ6_Nwk3i1tHB215QFunpYlUvV313mo2w6-3oWIpl83MDZ5jtiZAF3baJkR3GWde-Xge-w2ltDEkX7iKvCVmV0I)',
            }}
          ></div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;

