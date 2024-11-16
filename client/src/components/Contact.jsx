import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ car }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');
  
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`/api/user/${car.userRef}`);
        const data = await res.json();
        setOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [car.userRef]);

  return (
    <>
      {owner && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{owner.username}</span>{' '}
            about{' '}
            <span className='font-semibold'>{car.title.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
            to={`mailto:${owner.email}?subject=Regarding ${car.title}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}
