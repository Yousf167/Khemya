import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { locationsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CampsiteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [campsite, setCampsite] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationRes, reviewsRes] = await Promise.all([
          locationsAPI.getById(id),
          reviewsAPI.getByLocation(id),
        ]);
        setCampsite(locationRes.data);
        setReviews(reviewsRes.data || []);
        if (locationRes.data.packages && locationRes.data.packages.length > 0) {
          setSelectedPackage(locationRes.data.packages[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Mock data
        setCampsite({
          id,
          title: 'Siwa Oasis Star Camp',
          location: 'Siwa, Egypt',
          description: 'Escape to the serene beauty of the Siwa Oasis at our Star Camp.',
          price: 1200,
          rating: 4.8,
          reviewCount: 124,
          images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB1tsc50QptugZQ75zbTKscHj-B0MxD_HVEonXVqEOHm5FeAbrKBsE1RJZHFR6fQDl-UT82qkC6Y7odf-Y7R6nIFrs_TJOi1SQHE_50yNTYUZQk1v020rgHucodI1Ofq3qKVVPLDgLbw1l0Hy14vObWBzTjJ3tYLoEPKUbIpWqOAiwM_MmHuJ2oc-OZ3oUeDpdr0b8_SyirTYXWxPazBV3v845l85-sz3JCZtQBPUHQmrcn2R1vJTQHilGyBFM2Yz_A9c1WvdyePA8',
          ],
          packages: [
            { id: '1', name: 'Bring Your Own Tent', price: 300, description: 'Access to camp grounds' },
            { id: '2', name: 'Glamping Hut', price: 1200, description: 'Private hut with bed', popular: true },
          ],
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`, {
      state: {
        campsite,
        package: selectedPackage,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!campsite) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-text-muted">Campsite not found</div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div className="flex flex-wrap gap-2 items-center text-sm mb-6 text-text-muted">
          <a href="/" className="hover:text-primary transition-colors">
            Home
          </a>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            chevron_right
          </span>
          <span className="text-text-main font-medium">{campsite.location}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main mb-2">
              {campsite.title}
            </h1>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="flex items-center font-bold text-text-main">
                <span className="material-symbols-outlined fill text-primary mr-1" style={{ fontSize: '18px' }}>
                  star
                </span>
                {campsite.rating}
              </span>
              <span className="text-text-muted">·</span>
              <span className="text-text-muted">{campsite.reviewCount || 0} reviews</span>
              <span className="text-text-muted">·</span>
              <span className="text-text-muted">{campsite.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[480px] rounded-2xl overflow-hidden mb-10">
          <div className="md:col-span-2 md:row-span-2 relative">
            <div
              className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${campsite.images?.[0] || '/placeholder.jpg'})` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-text-main">About this space</h3>
              <p className="text-text-muted leading-relaxed">{campsite.description}</p>
            </div>

            {campsite.packages && campsite.packages.length > 0 && (
              <div className="border-t border-gray-100 pt-10">
                <h3 className="text-2xl font-bold text-text-main mb-6">Choose your experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campsite.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative border-2 ${
                        selectedPackage?.id === pkg.id ? 'border-primary bg-primary/5' : 'border-transparent bg-[#f0f4f1]'
                      } p-5 rounded-xl cursor-pointer hover:bg-[#e6ebe7] transition-colors group`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 right-4 bg-primary text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                          POPULAR
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <span className="material-symbols-outlined text-text-main p-2 bg-white rounded-lg">
                          camping
                        </span>
                        <div
                          className={`size-5 rounded-full border-2 ${
                            selectedPackage?.id === pkg.id
                              ? 'border-primary bg-white'
                              : 'border-gray-400 group-hover:border-primary'
                          }`}
                        ></div>
                      </div>
                      <h4 className="font-bold text-lg mb-1">{pkg.name}</h4>
                      <p className="text-sm text-text-muted mb-3">{pkg.description}</p>
                      <p className="font-bold text-text-main">
                        EGP {pkg.price} <span className="font-normal text-sm text-text-muted">/ night</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-xl shadow-xl p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-2xl font-bold text-text-main">
                    EGP {selectedPackage?.price || campsite.price}
                  </span>
                  <span className="text-text-muted text-sm"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <span className="material-symbols-outlined fill text-primary" style={{ fontSize: '16px' }}>
                    star
                  </span>
                  {campsite.rating} <span className="text-text-muted font-normal underline">({campsite.reviewCount})</span>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b border-gray-300">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer border-r border-gray-300">
                    <label className="block text-[10px] font-bold text-text-main uppercase tracking-wider">
                      Check-in
                    </label>
                    <input
                      type="date"
                      className="text-sm text-text-muted border-none bg-transparent w-full"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <label className="block text-[10px] font-bold text-text-main uppercase tracking-wider">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="text-sm text-text-muted border-none bg-transparent w-full"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase tracking-wider">Guests</label>
                    <div className="text-sm text-text-muted">{guests} guests</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReserve}
                className="w-full bg-primary hover:bg-[#0fd630] text-black font-bold py-3.5 rounded-lg transition-colors mb-4 text-lg"
              >
                Reserve
              </button>
              <p className="text-center text-xs text-text-muted mb-6">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampsiteDetailPage;

