import React from 'react'
import Navbar from './navbar';
import Cards from './cards';
import Oldmoviecards from './oldmoviecards';
import CustomIcons from './pagination';
import { useEffect ,useState} from 'react';
import axios from 'axios';
const Home = () => {
    const [latestMovies,setLatestMovies]= useState([]);
    const [oldMovies, setOldMovies]= useState([]);

    const[searchedMovie,setSearchedMovie]= useState([]);
    const [currentPage, setCurrentPage]= useState(1);
    


    const loadAllMovies=()=>{
        axios.get('http://localhost:3000/movies',{

            headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        
        .then(response=>{
            setOldMovies(response.data.movies);
        
        }).catch(error=>{
            console.error('ERROR FETCHING MOVIES:',error)
        });

    }


  

    useEffect(()=>{

        loadAllMovies();
        

        axios.get('http://localhost:3000/latestMovies',{
            headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(response=>{
            setLatestMovies(response.data.movies);
           
                     
        }).catch(error=>{
            console.error("ERROR FETCHING MOVIES:",error)
        })
    },[])

    const handleSearch = (e) => {
        e.preventDefault();
       console.log("current search input value:",searchedMovie)
       
        // if(!searchedMovie.trim()){

        //     console.log("Search input is empty, reloading all movies")
        //     loadAllMovies();
          
        //     return;
         
      
              
        //   }

     
        console.log("searched movie from input:", searchedMovie)  
        axios.get(`http://localhost:3000/searchmovie?q=${searchedMovie}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
            console.log("fetched movies are",response.data.movies)
          setOldMovies(response.data.movies)
        })
        .catch(error => {
            console.error("ERROR SEARCHING MOVIES:", error);
        });
    };


    const handleInputChange =(e)=>{
        const value= e.target.value;
        setSearchedMovie(value);

        if(!value.trim()){
            console.log("Input is cleared, reloading all movies")
            loadAllMovies();
        }
    }

    return (

        <div className='home' >
            <Navbar />
            <div className='container mt-5 d-flex flex-column align-items-center '>
                <h2 className=' text-light mb-4 '>welcome to theAter</h2>
                <form className='d-flex mb-4' action="" onSubmit={handleSearch}>
                    <input type="search" className='form-control ' placeholder="Search for title or IMDb-ID" style={{ width: '250px', background: 'transparent' }}  onChange={handleInputChange} />
                    <button className='btn  mx-2 searchbutton'>Search</button>
                </form>
            </div>

            <div className='container my-5 '>
                <div className='d-flex align-items-center mb-4'>
                    <h3 className='text-light me-2'>LATEST MOVIES</h3>
                    <p className='text-secondary mb-0'>newly added movies</p>
                </div>
                <Cards movies={latestMovies}/>
            </div>


            <div className='container  mt-5 '>
                <h3 className='text-light '>MOVIES </h3>
                <p className='text-secondary mb-4 '>  Explore the world of films <b className='text-light px-2'> lets explore</b> </p>

                <Oldmoviecards movies={oldMovies} />
            </div>
            <div className='d-flex justify-content-center py-5'>
                <CustomIcons />
            </div>


        </div>


    )
}

export default Home;