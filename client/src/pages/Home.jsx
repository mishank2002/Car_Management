import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import CarItem from '../components/CarItem';

export default function Home() {
  const [offerCars, setOfferCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError('');
  
        // Fetch cars with offers
        const resOffers = await fetch('/api/car/get?offer=true&limit=4');
        if (resOffers.status === 401) {
          throw new Error('Failed to fetch offer cars. Unauthorized.');
        }
        const offerData = await resOffers.json();
        setOfferCars(offerData);
  
        // Fetch all cars
        const resAllCars = await fetch('/api/car/get?limit=10');
        if (resAllCars.status === 401) {
          throw new Error('Failed to fetch all cars. Unauthorized.');
        }
        const allData = await resAllCars.json();
        setAllCars(allData);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError(error.message || 'Something went wrong while loading cars.');
        setLoading(false);
      }
    };
  
    fetchCars();
  }, []);
  

  return (
    <div>
      {/* Top section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          car with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Welcome to Car Management! Browse our wide range of cars available for sale or rent.
          <br />
          Find the perfect car for your needs today!
        </div>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Explore All Cars
        </Link>
      </div>

      {/* Swiper for offers */}
      {offerCars.length > 0 && (
        <Swiper navigation>
          {offerCars.map((car) => (
            <SwiperSlide key={car._id}>
              <div
                style={{
                  background: `url(${car.images[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Car listings */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* Recent Offers */}
        {offerCars.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?offer=true"
              >
                View All Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerCars.map((car) => (
                <CarItem car={car} key={car._id} />
              ))}
            </div>
          </div>
        )}

        {/* All Cars */}
        {allCars.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">All Cars</h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search"
              >
                Explore More Cars
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {allCars.map((car) => (
                <CarItem car={car} key={car._id} />
              ))}
            </div>
          </div>
        )}

        {loading && <p className="text-center text-xl text-gray-500">Loading...</p>}
        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}
        {!loading && allCars.length === 0 && !error && (
          <p className="text-center text-xl text-gray-500">No cars available!</p>
        )}
      </div>
    </div>
  );
}
