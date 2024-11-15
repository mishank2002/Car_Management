import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function CarDetails() {
  const { carId } = useParams(); // Ensure it matches the backend route
  const [car, setCar] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/car/get/${carId}`); // Ensure this matches your backend route
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to fetch car details');
          return;
        }
        setCar(data); // Use the API's response structure
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to fetch car details');
      }
    };    
    fetchCar();
  }, [carId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!car) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{car.title}</h1>
      <p className="text-lg mt-2">{car.description}</p>
      {car.tags && <p className="mt-2">Tags: {car.tags.join(', ')}</p>}
      {car.images && car.images.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl">Images</h2>
          <div className="flex gap-3 mt-2">
            {car.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Car ${index}`}
                className="w-32 h-32 object-cover border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
