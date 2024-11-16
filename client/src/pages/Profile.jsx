import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice.js';

export default function Profile() {
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userCars, setUserCars] = useState([]);
  const [showCarsError, setShowCarsError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => setFileUploadError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleShowCars = async () => {
    setShowCarsError(false);
    try {
      console.log("Attempting to fetch cars for user:", currentUser._id);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      console.log("Response status:", res.status);
  
      const data = await res.json();
      console.log("Fetched data:", data);
  
      // If data is an array, assume the fetch was successful
      if (Array.isArray(data)) {
        setUserCars(data);
      } else {
        console.error("Unexpected data format:", data);
        setShowCarsError(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setShowCarsError(true);
    }
  };
  
  
  
  

  const handleDeleteCar = async (carId) => {
    try {
      const res = await fetch(`/api/car/delete/${carId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserCars((prev) => prev.filter((car) => car._id !== carId));
          console.log("Car deleted successfully");
          alert("Car deleted successfully"); // Optional: shows a popup message
        } else {
          console.error("Error deleting car:", data.error);
          alert(`Failed to delete car: ${data.error}`);
        }
      } else {
        console.error("Failed to delete car, status code:", res.status);
        alert(`Failed to delete car. Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while deleting the car");
    }
  };


  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-up');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm text-center mt-2">
          {fileUploadError ? (
            <span className="text-red-500">Error uploading image</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-blue-500">{`Uploading ${filePerc}%...`}</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
        {currentUser && (
  <Link
    className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 mt-4"
    to="/create-car"
  >
    Add a New Car
  </Link>
)}

      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </span>
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>
      <button
        className="text-green-700 mt-5 hover:underline"
        onClick={handleShowCars}
      >
        Show My Cars
      </button>
      {userCars.length > 0 && (
        <div className="flex flex-col gap-4 mt-5">
          <h2 className="text-2xl font-semibold text-center">Your Cars</h2>
          {userCars.map((car) => (
            <div
              key={car._id}
              className="border p-3 flex justify-between items-center"
            >
              <Link to={`/car/${car._id}`}>
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="h-16 w-16 object-cover"
                />
              </Link>
              <Link
                to={`/car/${car._id}`}
                className="flex-1 truncate text-slate-700 hover:underline"
              >
                {car.title}
              </Link>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDeleteCar(car._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {showCarsError && (
        <p className="text-red-500 text-center mt-5">Failed to load your cars</p>
      )}
    </div>
  );
}
