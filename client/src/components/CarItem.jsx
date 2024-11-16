import { Link } from 'react-router-dom';

export default function CarItem({ car }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/car/${car._id}`}>
        <img
          src={
            car.images[0] ||
            'https://via.placeholder.com/330x220?text=Car+Image'
          }
          alt='car cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {car.title}
          </p>
          <p className='text-sm text-gray-600 truncate w-full'>
            {car.description}
          </p>
          <div className='text-slate-700 flex gap-4 mt-2'>
            <div className='font-bold text-xs'>
              Tags: {car.tags.join(', ')}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
