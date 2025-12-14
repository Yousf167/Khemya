import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { locationsAPI } from '../services/api';

const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDates, setSearchDates] = useState('');
  const [searchGuests, setSearchGuests] = useState('');
  const [featuredCampsites, setFeaturedCampsites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured campsites
    locationsAPI
      .getAll({ page: 0, size: 4, sort: 'rating,desc' })
      .then((response) => {
        setFeaturedCampsites(response.data.content || []);
      })
      .catch(() => {
        // Mock data for development
        setFeaturedCampsites([
          {
            id: '1',
            title: 'White Desert Camp',
            location: 'Farafra, Egypt',
            price: 50,
            rating: 4.9,
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuABJ-WgZxCPM-8Bw5YZ4e_ucruNsS8Bj2BfX5WInqrmkLgmhuE5OGXnx_e0oQvJWAd2bmP2FNkz7rAQTuj9zVpodbpgte_Ko_h6jN2_f7_qzXuug48Um0_lchm6DSb_F4Y-_lI3WiF00SCbBGtKXmptrnx42mNjv28lgaN0V-xfkPAywJPOqJ7hZTqP_f3QQQKqzOug2OrYFru5fSTy9k2ySXtOP82UM4MTxghLyl-OiKU7DPp_-ynVIxGefYU2QKigEpuSJ84b24g',
          },
          {
            id: '2',
            title: 'Siwa Oasis Retreat',
            location: 'Siwa, Egypt',
            price: 65,
            rating: 4.8,
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuB_swRydJXU0YZooaivaA18y9I8AQG2gd3v_cibTWxKkkUBi-xQcNv8PW4v4r5w7tyx2qEeeq5le86cDfnBZs-GZFonenn9NRez26U0GuW-iDKVtgaAIX-sORGtN2PWco6dgj1Yi3g0FxsvmBZfWyQOdYMlEMhQ3fdYzDoei_2l2-eSd6ZnhFlS12QqbJhdgC5VL86zqvK9-GHKHc276ClFu9jk6wlgPp0xEeXEYV7MuXdPuKHuNtyDLz2E5OsEzyoxbbw8_xjtiIY',
          },
          {
            id: '3',
            title: 'Red Sea Eco-Lodge',
            location: 'Marsa Alam, Egypt',
            price: 85,
            rating: 4.7,
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAYI0V-7xyVi0hPv3Kliyxq8_pojI5lDGbNsOiSGF4BSkRb284ScPLP5Bhh0O0bi5_hI8zScbB0ixIRfL7pSHF--Pn_jVQI83hjSTw4dBytIiBpupC1grIXlc2Gvv0Hm8axxsKoY_zA9Z3r8IKDHdzSzPUXZiTAztrh3OjCJfTzM1LUGsyB0H5CtvjBWbiRpzR0f-aFhXh5XZa5x8KJYU9x4N3ER_t1gvcfGLlNW1ZM1aCYee0h9P7tM-ZmYsTou4-VMSaD9kpcceA',
          },
          {
            id: '4',
            title: 'Fayoum Glamping',
            location: 'Fayoum, Egypt',
            price: 120,
            rating: 5.0,
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCudjwBo-L_VXUydc1DVmgcxJg1HeOmVZdomnSJj09oTNzYNcL5SzjDQ1kmY7NmY6ap5566nBe3Fg1XjqK-Q9PWpRFXipxH2v9sArDFT6cPpJjCQ8WfvsnxOpxTT5BynyI70-4hyF4rxpDOPqj1kKA4WjGxEcgGq2KIRTSAlo9llQcx9vSXKlZp1y2349qdmRYCa0oeKJeyr_aqB37zVB3kBylYWbn-bWzM0ML6PB1fEDhs_6_iYchwYdfWOkZ5MkF2s_ho9xcx7cY',
          },
        ]);
      });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append('q', searchLocation);
    if (searchDates) params.append('dates', searchDates);
    if (searchGuests) params.append('guests', searchGuests);
    navigate(`/campsites?${params.toString()}`);
  };

  const categories = [
    { name: 'All', icon: 'all_inclusive' },
    { name: 'Desert', icon: 'landscape' },
    { name: 'Beach', icon: 'beach_access' },
    { name: 'Eco-Lodge', icon: 'eco' },
    { name: 'Glamping', icon: 'diamond' },
    { name: 'Mountain', icon: 'hiking' },
  ];

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-4 py-6 lg:px-20 lg:py-10">
          <div
            className="relative flex min-h-[560px] flex-col items-center justify-center gap-8 rounded-2xl overflow-hidden bg-cover bg-center p-6 text-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDqQPLMUHfCzioPKuUKZqGVSfOy36J2Qar8QnY_L0dX5Rq_gqzAXUpDo1y_qaUu7j33PPienp5-53sY2siIDyHswITbNAvtaye_DNpheiVvBRaOdbBiaLE-PBudAMpnUVQvqGxz-Xi_vANC7siqRjt-Dhgj7NkwM3-cBLoHQOWaKRLJSAybxSZtYUG6bBf_ZqVzYUlQUg-K4lkKFzz9NYoiKKEEfLbfvkUE0asQow90sYZ7c7t-ZGfZmnDNmsJbh4KHpp6Oy6GpCms)',
            }}
          >
            <div className="flex flex-col gap-4 max-w-3xl z-10">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl drop-shadow-sm">
                Discover the Wild Side of Egypt
              </h1>
              <h2 className="text-white/90 text-lg font-medium md:text-xl drop-shadow-sm max-w-2xl mx-auto">
                From the White Desert to the Red Sea—find your perfect campsite today.
              </h2>
            </div>

            {/* Search Module */}
            <div className="w-full max-w-4xl z-10 mt-4">
              <div className="flex flex-col md:flex-row bg-surface-light dark:bg-surface-dark rounded-xl p-2 shadow-xl border border-border-light dark:border-surface-border gap-2 md:gap-0">
                {/* Location Input */}
                <div className="flex-1 relative flex items-center px-4 py-3 md:border-r border-border-light dark:border-surface-border">
                  <span className="material-symbols-outlined text-text-muted dark:text-text-muted-dark mr-3">location_on</span>
                  <div className="flex flex-col w-full">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                      Location
                    </label>
                    <input
                      className="w-full p-0 border-none text-sm font-medium text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:ring-0 bg-transparent h-6"
                      placeholder="Where do you want to camp?"
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dates Input */}
                <div className="flex-1 relative flex items-center px-4 py-3 md:border-r border-border-light dark:border-surface-border">
                  <span className="material-symbols-outlined text-text-muted dark:text-text-muted-dark mr-3">calendar_today</span>
                  <div className="flex flex-col w-full">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                      Dates
                    </label>
                    <input
                      className="w-full p-0 border-none text-sm font-medium text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:ring-0 bg-transparent h-6"
                      placeholder="Add dates"
                      type="text"
                      value={searchDates}
                      onChange={(e) => setSearchDates(e.target.value)}
                    />
                  </div>
                </div>

                {/* Guests Input */}
                <div className="flex-1 relative flex items-center px-4 py-3">
                  <span className="material-symbols-outlined text-text-muted dark:text-text-muted-dark mr-3">group</span>
                  <div className="flex flex-col w-full">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                      Guests
                    </label>
                    <input
                      className="w-full p-0 border-none text-sm font-medium text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:ring-0 bg-transparent h-6"
                      placeholder="Add guests"
                      type="text"
                      value={searchGuests}
                      onChange={(e) => setSearchGuests(e.target.value)}
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="p-1">
                  <button
                    onClick={handleSearch}
                    className="w-full md:w-auto h-full min-h-[48px] px-8 bg-primary hover:bg-primary/90 text-[#111812] rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined">search</span>
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-6 lg:px-20 py-8">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-[#111812] dark:text-white text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/campsites?category=${category.name.toLowerCase()}`}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-light dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-border hover:border-primary transition-colors group"
                >
                  <span className="material-symbols-outlined text-text-muted dark:text-text-muted-dark group-hover:text-primary text-[20px]">
                    {category.icon}
                  </span>
                  <span className="text-sm font-medium text-text-main dark:text-white">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="px-6 lg:px-20 py-8 bg-surface-light dark:bg-transparent">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-text-main dark:text-white text-2xl font-bold">
                Top Rated Campsites this Month
              </h2>
              <Link
                to="/campsites"
                className="text-sm font-bold text-text-main dark:text-white hover:text-primary underline decoration-2 decoration-primary/50 hover:decoration-primary underline-offset-4"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCampsites.map((campsite) => (
                <Link
                  key={campsite.id}
                  to={`/campsites/${campsite.id}`}
                  className="group flex flex-col gap-3 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      alt={campsite.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={campsite.imageUrl}
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white text-text-muted hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[20px] block">favorite</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-text-main dark:text-white truncate">{campsite.title}</h3>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[16px] fill-current">star</span>
                        <span className="text-sm font-medium">{campsite.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted dark:text-text-muted-dark">{campsite.location}</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-base font-bold text-text-main dark:text-white">${campsite.price}</span>
                      <span className="text-sm text-text-muted dark:text-text-muted-dark">/ night</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Kheyma Section */}
        <section className="px-6 lg:px-20 py-16 bg-surface-light dark:bg-surface-dark my-10 border-y border-border-light dark:border-surface-border">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text-main dark:text-white">Why Choose Kheyma?</h2>
              <p className="text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
                We connect you with the most authentic, safe, and breathtaking camping experiences across Egypt.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined text-4xl">verified_user</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-main dark:text-white">Verified Hosts</h3>
                <p className="text-text-muted dark:text-text-muted-dark leading-relaxed">
                  Every campsite is personally visited and verified by our team to ensure safety and quality.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined text-4xl">payments</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-main dark:text-white">Secure Payments</h3>
                <p className="text-text-muted dark:text-text-muted-dark leading-relaxed">
                  Book with confidence using our encrypted payment system. No hidden fees on arrival.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined text-4xl">support_agent</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-main dark:text-white">24/7 Support</h3>
                <p className="text-text-muted dark:text-text-muted-dark leading-relaxed">
                  From booking to check-out, our local support team is here to help you anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-6 lg:px-20 py-16">
          <div className="max-w-4xl mx-auto bg-background-dark dark:bg-primary rounded-2xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 dark:bg-black/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-text-main mb-2">
                  Join the Adventure
                </h2>
                <p className="text-white/80 dark:text-text-main/80">
                  Get the latest campsite drops and exclusive offers directly to your inbox.
                </p>
              </div>
              <div className="w-full md:w-auto flex-1 max-w-md">
                <div className="flex gap-2">
                  <input
                    className="w-full px-4 py-3 rounded-lg border-0 bg-white/10 dark:bg-white/90 text-white dark:text-black placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary dark:focus:ring-black"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <button className="px-6 py-3 bg-primary dark:bg-[#111812] text-[#111812] dark:text-white font-bold rounded-lg whitespace-nowrap hover:brightness-110 transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

