import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ variant = 'light' }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = variant === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between border-b ${
        isDark
          ? 'border-border-dark bg-background-dark'
          : 'border-border-light dark:border-surface-border bg-surface-light dark:bg-background-dark'
      } px-6 py-3 lg:px-20`}
    >
      <Link to="/" className="flex items-center gap-4 text-text-main dark:text-white">
        <div className="size-8 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">camping</span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Kheyma</h2>
      </Link>

      <div className="hidden lg:flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-8">
          <Link
            to="/campsites"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              isDark ? 'text-white/80 hover:text-white' : 'text-text-main dark:text-white'
            }`}
          >
            Destinations
          </Link>
          <Link
            to="/activities"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              isDark ? 'text-white/80 hover:text-white' : 'text-text-main dark:text-white'
            }`}
          >
            Activities
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              isDark ? 'text-white/80 hover:text-white' : 'text-text-main dark:text-white'
            }`}
          >
            About Us
          </Link>
        </nav>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex h-10 items-center justify-center rounded-lg px-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold"
              >
                Profile
              </Link>
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  className="flex h-10 items-center justify-center rounded-lg px-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex h-10 items-center justify-center rounded-lg px-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex h-10 items-center justify-center rounded-lg px-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center justify-center rounded-lg px-6 bg-primary text-[#111812] text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <button className="lg:hidden p-2 text-text-main dark:text-white">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};

export default Navbar;

