import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const Navbari = ({isSignup}) => {


    
    var navigate = useNavigate()

    return (


        <div className='navbaribg'>
            <nav className="navbar justify-content-between" >
                <a className="navbar-brand px-5 fs-2 fw-bold" href='/'>theAter</a>
                {isSignup?
                                <button className="btn mx-5" type="submit" onClick={()=>{
                                    navigate('/login')
                                  
                                    console.log(b)
                                   
                                }} > Sign In</button>
                                :
                                <button className="btn mx-5" type="submit" onClick={()=>{
                                    navigate('/register')
                                    
                                    console.log(b)
                                
                                }

                                } > Sign Up</button>


                            }

            </nav>
        </div>
    )
}

export default Navbari;