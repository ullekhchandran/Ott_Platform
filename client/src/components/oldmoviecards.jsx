import React from 'react'
import Card from './card';

function Oldmoviecards({movies}) {

   
    // const oldmovies=['oldmovies.jpg','oldmovies1.jpg','oldmovies2.jpg','oldmovies3.jpg','oldmovies4.jpg','oldmovies6.jpg','oldmovies7.jpg']
    // const titles=['Us','Wanderlust','Tron','Thriller','Wood','Stars Wars','SE7EN']
  return (
    <div className='text-light'>
         <div className='row'>
        {movies.map((movie,index)=>(
            <div className='col-lg-2 col-md-3 col-4 mb-4' key={index}>
                <Card image={movie.thumbnail} title={movie.title} id={movie._id}/>
            </div>

        ))}
      </div>
    </div>
  )
}

export default Oldmoviecards;