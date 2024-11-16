import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateCar from './pages/CreateCar'; // For creating a car listing
import UpdateCar from './pages/UpdateCar'; // For updating a car listing
import CarDetail from './pages/CarDetails'; // For viewing individual car details
import SearchCars from './pages/SearchCars'; // For searching cars

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<SearchCars />} />
        <Route path="/car/:carId" element={<CarDetail />} />
        <Route path="/search" element={<SearchCars />} />
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-car" element={<CreateCar />} />
          <Route path="/update-car/:carId" element={<UpdateCar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
