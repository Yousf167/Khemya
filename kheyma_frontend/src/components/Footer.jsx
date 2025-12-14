import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-light dark:bg-background-dark border-t border-[#f0f4f1] dark:border-[#2a3c2e] pt-16 pb-8 px-6 lg:px-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-text-main dark:text-white">
            <span className="material-symbols-outlined text-primary text-3xl">camping</span>
            <h2 className="text-xl font-bold">Kheyma</h2>
          </div>
          <p className="text-text-muted dark:text-text-muted-dark text-sm leading-relaxed">
            Connecting nature lovers with the most unique camping experiences in Egypt.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-text-muted-dark hover:bg-primary hover:text-black transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-text-muted-dark hover:bg-primary hover:text-black transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-text-main dark:text-white">Explore</h3>
          <div className="flex flex-col gap-2">
            <Link
              to="/campsites"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Destinations
            </Link>
            <Link
              to="/activities"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Activities
            </Link>
            <Link
              to="/campsites?type=eco-lodge"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Eco-Lodges
            </Link>
            <a
              href="#"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Deals
            </a>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-text-main dark:text-white">Company</h3>
          <div className="flex flex-col gap-2">
            <Link
              to="/about"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              About Us
            </Link>
            <a
              href="#"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Careers
            </a>
            <a
              href="#"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Press
            </a>
            <Link
              to="/contact"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-text-main dark:text-white">Support</h3>
          <div className="flex flex-col gap-2">
            <a
              href="#"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Help Center
            </a>
            <a
              href="#"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Safety Information
            </a>
            <a
              href="#"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Cancellation Options
            </a>
            <a
              href="#"
              className="text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors text-sm"
            >
              Host an Experience
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-8 border-t border-gray-100 dark:border-surface-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-muted dark:text-text-muted-dark text-sm">© 2023 Kheyma Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="text-text-muted dark:text-text-muted-dark hover:text-primary text-sm" href="#">
            Privacy
          </a>
          <a className="text-text-muted dark:text-text-muted-dark hover:text-primary text-sm" href="#">
            Terms
          </a>
          <a className="text-text-muted dark:text-text-muted-dark hover:text-primary text-sm" href="#">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

