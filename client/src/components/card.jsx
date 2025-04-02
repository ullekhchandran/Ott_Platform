import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Rating from './rating';
import axios from 'axios';
import { BACKEND_URL } from '../config';

import { toast } from 'react-toastify';



function Card({ image, title, id, isWatchLaterPage, onRemoveMovie, isWatchHistoryPage, watchedAt, count }) {
  
  const [isAdded, setIsAdded] = useState(false);

  const navigate = useNavigate();



useEffect(() => {
  setIsAdded(isWatchLaterPage);
}, [isWatchLaterPage]);

  const handleNavigate = () => {
    navigate(`/movie/${id}`);
     console.log("IMAGE IS",image)
    console.log("Navigating to movie with Id:", id);

    axios.post(`${BACKEND_URL}/watchhistory`, { movieId: id })
      .then((response) => {
        if (response.data.message === "movie saved to watchHistorySchema") {
         
          console.log("movie saved to watchHistorySchema")
        }
        else if (response.data.message === "updated watchhistory with time") {
       
          console.log("updated watchhistory with time")


        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message === "movie already added") {
          console.warn("Movie already in Watch Later!"); 
          toast.error("Movie is already in Watch Later!"); // ✅ Show toast warning
      } else {
          console.error("Error adding to watch later:", error);
      }
      })


  };


  const handleClick = () => {
    console.log("Button clicked, current state of isAdded:", isAdded);

    if (isAdded) {
        console.log("Removing movie id is", id);

        axios.delete(`${BACKEND_URL}/removemovie`, {
            data: { movieId: id }
        })
        .then((response) => {
            if (response.data.message === 'Movie removed from watchLaterSchema') {
                setIsAdded(false);
                console.log("Movie removed from watchLaterSchema");
                onRemoveMovie(id);  // This ensures UI updates instantly
            }
        })
        .catch((error) => {
            console.error("Error removing movie:", error);
        });

    } else {
        axios.post(`${BACKEND_URL}/watchlater/`, { movieId: id })
        .then((response) => {
            if (response.data.message === "movie added to watch laterschema") {
                setIsAdded(true);
                console.log("Added to watch later");
            }
        })
        .catch(error => {
            console.error("Error adding to watch later:", error);
            if (error.response?.status === 400 && error.response.data.message === "movie already added") {
              toast.warning("Movie is already in Watch Later!");  // ✅ Warning message
            } else {
              toast.error("Failed to add movie!"); // General error message
            }
        });
    }
};




  return (
    <div className='card border-none animate-card' style={{ cursor: 'pointer' }}>
      <img src={`${BACKEND_URL}/images/${image}`} alt="Movie Poster" className="card-img img-fluid" onClick={handleNavigate} />
      <div className='card-body'>
        <h4 className='card-title text-light mb-0'>{title}</h4>
        {isWatchHistoryPage && <p className='text-secondary'>Watched on : {new Date(watchedAt).toLocaleDateString()}</p>}
        {isWatchHistoryPage && <p className='text-secondary'>viewed: {count}</p>}


        <div className='d-flex justify-content-between align-items-center flex-wrap gap-1 '>
          <div className=''>

            {!isWatchHistoryPage && (
              <Rating />
            )}

          </div>
          {!isWatchHistoryPage && (
            <button className='btn btn-outline-secondary rounded-3 mt-md-0' onClick={handleClick}>
              {isAdded ? '-' : '+'}
            </button>
          )}
         
          {/* {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>} */}
        </div>
      </div>
    </div>
  );
}

export default Card;
