import React, { useState } from 'react';
import bgImage from "../assets/movie1.jpg";
import Navbari from './navbari';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email,password)
        console.log("bACKEND URL: ",BACKEND_URL)
        axios.post(`${BACKEND_URL}/login`, { email, password })
            .then((response) => {
              
                if (response.data.message === "loginsuccess") {
                    localStorage.setItem('token', response.data.token);
            
                    localStorage.setItem('name',response.data.userName)
                    navigate('/home');
                } 
            })  
            .catch((error) => { 
              
               if(error.response && error.response.status === 401){
                setErrorMessage("Invalid credentials. Please try again.")
               }
               else if(error.response && error.response.status === 402){
                setErrorMessage("This user is blocked")
               }
               else if(error.response && error.response.status === 500){
                setErrorMessage("Internal server error. Please try again.")
               }else{
                setErrorMessage("An unknown error occured. Please try again.")
               }
               console.log("Login error:",error);
            });
    };

    return (
        <div>
            <div className='registerbg' style={{backgroundImage:`url(${bgImage})`}}>
                <Navbari isSignup={false}  />
                <div className="container d-flex justify-content-center align-items-center signupform my-5">
                    <form className="w-50 my-5" onSubmit={handleSubmit}>
                        <h2 className="text-light">Sign In</h2>
                        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>} 

                        <div className="mt-4">
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                placeholder="Enter your email" 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mt-4">
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Enter your password" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-outline-secondary">Submit</button>
                        </div>
                        <div className='text-center mt-3'>
                            <a href="/resetPassword" className='text-decoration-none text-secondary'>Forgot password?</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
