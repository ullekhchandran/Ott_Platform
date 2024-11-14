
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Navbari from './navbari';

function LandingPage(){
  
    const navigate= useNavigate();
    const signup=()=>{
     
        navigate('/register')
    }
   
   
    return(
        <div>
            
            <div className='landingpage'>
            <Navbari isSignup={true} />

            <div className='text-light landingpagetitle mx-5'>
            <h1 className='display-4 fw-bold'>Unlimited movies and more </h1>
            <h4>Starts at $187. Cancel at any time. </h4>
            <p className='mt-2 '>Ready to watch?</p>

             <button type='submit' onClick={signup} className='btn'>Sign Up</button>

            </div>
           
           
        </div>
        </div>
    )
}
export default LandingPage;