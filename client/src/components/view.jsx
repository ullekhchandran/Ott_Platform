import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import Rating from './rating';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useParams } from 'react-router-dom';

function View() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/movie/${id}`)
      .then(response => {
        setMovie(response.data.movie); // Movie data
        setUser(response.data.user); // User data, if needed
        console.log("Movie data:", response.data.movie);
        console.log("User data:", response.data.user);
        // console.log("IMAGEEEE IS :" ,movie.thumbnail);
      })
      .catch(error => {
        console.error("Error fetching movie details:", error);
      });
  }, [id]);

  if (!movie) {
    return <div className="text-light">Loading...</div>;
  }

  // Extract video ID from the video URL
  // const videoId = movie.viedio.split('/').pop(); 
  // const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className='view'>
      <Navbar />
      <div className='container border border-secondary p-3 my-4'>
        <div className='row align-items-center'>
          <div className='col-lg-6 pt-2'>
            {/* <iframe
              className='w-100'
              style={{ height: '400px', objectFit: 'contain' }}
              src={videoSrc}
              title="Movie Video"
              controls
            /> */}
              <video className='w-100' style={{height:"400px", objectFit:'cover'}} controls>
              <source src={`${BACKEND_URL}/images/${movie.video}`} type="video/mp4" />
              Your browser does not support the HTML5 video tag.
            </video>
          </div>
          <div className='col-lg-6 pt-1'>
        
            <img
              src={`${BACKEND_URL}/images/${movie.thumbnail}`}
              className='w-100'
              style={{ height: '400px', objectFit: 'fill' }}
              alt="Movie Poster"
            />
          </div>
        </div>
      </div>

      <div className='container text-light mt-3'>
        <div className='row'>
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <Rating />
          <p>Rating: {movie.rating || "N/A"}</p>
          {user && <p>Viewed by: {user.name}</p>}
          {user && <p>Viewed : {user.count}</p>}
        </div>
      </div>
    </div>
  );
}

export default View;
