import React from 'react'
import Navbar from './navbar';
import Cards from './cards';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { BACKEND_URL } from '../config';


function Watchhistory() {

  const [watchHistoryMovies,setwatchHistoryMovies]= useState([])
  useEffect(()=>{
    axios.get(`${BACKEND_URL}/watchhistory`).then((response)=>{
      setwatchHistoryMovies(response.data.watchHistory)
      console.log(response.data.watchHistory);

      response.data.watchHistory.forEach(movie => {
        console.log("watchedAt:", movie.watchedAt);
      });
      

     
    })
    .catch(error=>{
      console.error('ERROR FETCHING MOVIES:',error)
  });

  },[])

    

  return (
    <div className='home' >
            <Navbar />
    
            <div className='container  mt-5 '>
                <h3 className='text-light mb-5'>WatchHistory </h3>

                <Cards  movies={watchHistoryMovies} isWatchHistoryPage={true} watchedAt={watchHistoryMovies.watchedAt}/>
            </div>

        </div>

  )
}

export default Watchhistory;