import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Rating from './rating';
import axios from 'axios';
import { BACKEND_URL } from '../config';



function Card({ image, title, id, isWatchLaterPage, onRemoveMovie, isWatchHistoryPage, watchedAt, count }) {
  
  const [isAdded, setIsAdded] = useState(isWatchLaterPage);

  const navigate = useNavigate();





  const handleNavigate = () => {
    navigate(`/movie/${id}`);
     console.log("IMAGE IS",image)
    console.log("Navigating to movie with Id:", id);

    axios.post(`${BACKEND_URL}/watchhistory`, { movieId: id }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        if (response.data.message === "movie saved to watchHistorySchema") {
         
          console.log("movie saved to watchHistorySchema")
        }
        else if (response.data.message === "updated watchhistory with time") {
       
          console.log("updated watchhistory with time")


        }
      })
      .catch((error) => {
        console.error("Error adding movie to watch history:", error)
      })


  };


  const handleClick = () => {
    setIsAdded(true)

    console.log("Button clicked, current state of isAdded:", isAdded);
  

    if (isAdded) {
     
      console.log("movie id is", id);

      axios.delete(`${BACKEND_URL}/removemovie`, {
        data: { movieId: id },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then((response) => {
          if (response.data.message === 'Movie removed from watchLaterSchema') {
           

            setIsAdded(false);
            console.log("movie removed from watchLaterSchema", isAdded);
            setErrorMessage("Movie removed from watchLater")
       
            // window.alert("Movie removed from watchLater")
            
            onRemoveMovie(id);

          
          
         }

        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setErrorMessage("User not found MESSAGE FROM CARD component");
          } else if (error.response && error.response.status === 500) {
            setErrorMessage('Error while removing movie from watchLaterSchema');
          }
        });

    } else if (!isAdded) {


      axios.post(`${BACKEND_URL}/watchlater/`, { movieId: id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then((response) => {
          if (response.data.message === "movie added to watch laterschema") {
            setIsAdded(true)
            console.log("added to watch later");
            setErrorMessage("movie added to watch later")
            // window.alert("movie added to watch later")
          }


        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            if (error.response.data.message === 'user not found') {
              setErrorMessage("user not found");
            } else if (error.response.data.message === 'movie already added') {
              console.log('movie already addedddd');
              setIsAdded(true)

            }
          }
          else if (error.response && error.response.status === 500) {
            console.log("error HAPPENED WHILE ADDING TO WATCHLATER", error);
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
