import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { locationsAPI } from '../services/api';

const CampsiteListingPage = () => {
  const [searchParams] = useSearchParams();
  const [campsites, setCampsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: 400,
    maxPrice: 3000,
    type: [],
    amenities: [],
  });

  useEffect(() => {
    const fetchCampsites = async () => {
      setLoading(true);
      try {
        const params = {
          page: 0,
          size: 20,
          ...Object.fromEntries(searchParams),
        };
        const response = await locationsAPI.getAll(params);
        setCampsites(response.data.content || response.data || []);
      } catch (error) {
        console.error('Error fetching campsites:', error);
        // Mock data for development
        setCampsites([
          {
            id: '1',
            title: 'Basata Eco-Lodge',
            location: 'Nuweiba • Beachfront Husha',
            price: 1200,
            rating: 4.92,
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAjZTG48QRAGApuXtX4Ozt7wShBqg4kxrycxtuB4_dVY7f2Y2HTLdIYeXsUWf1pl2zYp_UH_-vZzsBBRU7Mzc5fUfUTMS3VGYFj_AYyhWxr-zFRw3g0GKvLqJtVZOcfDxQkcqbftdPK574k3SCz9t0w1dhQOvA6RoSCUI14kdFIadXXuyHvZvrimhEX1z5KhFlSs2ugqfzc3bgmvCtkQzvSE6yO4CgJ37wNqd32VAB-8GY_YwWQVf14lrISfffOYLjryJbK8W_8TWU',
          },
          {
            id: '2',
            title: 'Dayra Camp',
            location: 'Nuweiba • Air Conditioned Bungalow',
            price: 1800,
            rating: 4.85,
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAkUvOEIKBNvlZpIbqAHYWzNsiWBoOmqHJWzZSHdA4kODgu8YxLYp09Le7LBQrlKQDjOw6cF_6ReWlaAF9q8fXbq02957M3gSFSCtiM3RFvw74wNaxMS2-vtvtM4FB7p_3h9H2JBMxR1Fso6wyn_oxvjUG0ARAwmracJfSzfHlFvLHe10hvHCVTNcr2W4iwbF8DpoSMeRbugMcXOi2A7N_mtozu1KYLpXRKBeznuLRwZZ-rKXKp_gvg4ng5iAvI6x6VIdyBlScvrK0',
          },
        ]);
      }
      setLoading(false);
    };

    fetchCampsites();
  }, [searchParams]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-text-main hover:underline decoration-primary decoration-2 underline-offset-4">
            Egypt
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-text-main font-semibold">Campsites</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-8 h-fit sticky top-28">
            <div className="border-b border-gray-200 dark:border-surface-border pb-6">
              <h3 className="text-lg font-bold mb-4">Price range</h3>
              <div className="px-2">
                <div className="relative h-12 w-full flex items-center">
                  <div className="absolute w-full h-1 bg-gray-200 dark:bg-surface-border rounded"></div>
                  <div className="absolute h-1 bg-primary rounded left-[10%] right-[30%]"></div>
                </div>
                <div className="flex justify-between items-center gap-4 mt-2">
                  <div className="border border-gray-300 dark:border-surface-border rounded-lg px-3 py-1 w-full">
                    <span className="text-xs text-text-muted dark:text-text-muted-dark block">Min</span>
                    <span className="text-sm font-medium">EGP {filters.minPrice}</span>
                  </div>
                  <span className="text-text-muted dark:text-text-muted-dark">-</span>
                  <div className="border border-gray-300 dark:border-surface-border rounded-lg px-3 py-1 w-full">
                    <span className="text-xs text-text-muted dark:text-text-muted-dark block">Max</span>
                    <span className="text-sm font-medium">EGP {filters.maxPrice}+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-surface-border pb-6">
              <h3 className="text-lg font-bold mb-4">Type of place</h3>
              <div className="space-y-3">
                {['Traditional Camp', 'Eco-Lodge (Husha)', 'Glamping Dome', 'Private Tent'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      className="size-5 rounded border-gray-300 dark:border-surface-border text-primary focus:ring-primary/20"
                      type="checkbox"
                    />
                    <span className="text-text-main dark:text-white group-hover:text-primary-dark transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Listing Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-text-main mb-2">Available Campsites</h1>
              <p className="text-text-muted">{campsites.length} campsites found</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-text-muted">Loading...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {campsites.map((campsite) => (
                  <Link
                    key={campsite.id}
                    to={`/campsites/${campsite.id}`}
                    className="group flex flex-col gap-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={campsite.imageUrl || '/placeholder.jpg'}
                        alt={campsite.title}
                      />
                      <button className="absolute top-3 right-3 text-white/70 hover:text-white hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary-dark transition-colors">
                          {campsite.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm font-bold">
                          <span className="material-symbols-outlined text-primary text-[18px] fill">star</span>
                          {campsite.rating}
                        </div>
                      </div>
                      <p className="text-text-muted text-sm">{campsite.location}</p>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-bold text-text-main">EGP {campsite.price}</span>
                        <span className="text-text-main">/ night</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampsiteListingPage;

