import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarItem from '../components/CarItem';

export default function SearchCars() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    searchTerm: '',
    tags: '',
    sort: 'createdAt',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const tagsFromUrl = urlParams.get('tags');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || tagsFromUrl || sortFromUrl || orderFromUrl) {
      setFilters({
        searchTerm: searchTermFromUrl || '',
        tags: tagsFromUrl || '',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchCars = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/car/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setCars(data);
      setLoading(false);
    };

    fetchCars();
  }, [location.search]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', filters.searchTerm);
    urlParams.set('tags', filters.tags);
    urlParams.set('sort', filters.sort);
    urlParams.set('order', filters.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfCars = cars.length;
    const startIndex = numberOfCars;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/car/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setCars([...cars, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={filters.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Tags:</label>
            <input
              type="text"
              id="tags"
              placeholder="Tags (comma-separated)"
              className="border rounded-lg p-3 w-full"
              value={filters.tags}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue="createdAt_desc"
              id="sort"
              className="border rounded-lg p-3"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Order:</label>
            <select
              onChange={handleChange}
              defaultValue="desc"
              id="order"
              className="border rounded-lg p-3"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      {/* Results */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Search Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && cars.length === 0 && (
            <p className="text-xl text-slate-700">No cars found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
          )}
          {!loading &&
            cars &&
            cars.map((car) => <CarItem key={car._id} car={car} />)}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
