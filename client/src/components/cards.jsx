import React from 'react'
import Card from './card'
import { useNavigate } from 'react-router-dom'
function Cards({ movies,isWatchLaterPage, onRemoveMovie, isWatchHistoryPage}) {
  const navigate = useNavigate()
  

  return (
    <div className='text-light'>
      <div className='row'>
        {movies.map((movie) => {



          //display movie is for checking weather it is for latestmovies or watchlater
          //for watchlater the format is movie.movieId   prop send from  watchlater

          const displayMovie = movie.movieId ? movie.movieId : movie;
        return(
        <div className="col-lg-2 col-md-3 col-4 mb-4" key={displayMovie._id}>


          <Card image={displayMovie.thumbnail} title={displayMovie.title} id={displayMovie._id} watchedAt={ isWatchHistoryPage ? movie.watchedAt : null} count={displayMovie.count}  isWatchLaterPage={isWatchLaterPage}  onRemoveMovie={onRemoveMovie} isWatchHistoryPage={isWatchHistoryPage} />

      
        </div>

        );

      })}
      </div>

    </div>
  );
}

export default Cards;