import React from 'react';
import Navbar from './navbar';
import Cards from './cards';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomIcons from './pagination';
import { useNavigate } from 'react-router-dom';

const Watchlater = () => {
  const [watchlaterMovies, setWatchlaterMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 3;  // Set movies per page to 3
  const navigate=useNavigate()
  const fetchWatchLaterMovies = () => {
    axios.get(`${BACKEND_URL}/watchlater`, { withCredentials: true })
      .then(response => {
        setWatchlaterMovies(response.data.watchLaterMovies);
        console.log(response.data.watchLaterMovies);
      }).catch(error => {
        console.error('ERROR FETCHING MOVIES:', error);
      });
  };

  useEffect(() => {
    fetchWatchLaterMovies();
  }, []);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = watchlaterMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRemoveMovie = (movieId) => {
    console.log("Removing movie with ID:", movieId);

    // Immediately update UI by filtering out the movie
    setWatchlaterMovies(prevMovies => prevMovies.filter(movie =>
        movie.movieId._id !== movieId
    ));

    // Show toast notification
    toast.error("Movie removed from Watch Later");

    // Re-fetch movies to ensure backend is in sync
    fetchWatchLaterMovies();
};

  if(watchlaterMovies.length===0){
    navigate('/home')

  }
  return (
    <div className='home'>
      <Navbar />
      <ToastContainer position="top-center" /> {/* Display toast at the top center */}

      <div className='container mt-5'>
        <h3 className='text-light mb-5'>Watchlater</h3>
        <Cards movies={currentMovies} isWatchLaterPage={true} onRemoveMovie={handleRemoveMovie} />

        {/* Pagination using CustomIcons Component */}
        <CustomIcons
          count={Math.ceil(watchlaterMovies.length / moviesPerPage)}  // Calculate total pages
          page={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Watchlater;
