import React, { useState } from 'react'
import Navbari from './navbari'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import bgImage from "../assets/movie1.jpg";
import { BACKEND_URL } from '../config';

const Register = () => {
  

  const navigate= useNavigate()
  const [name,setName]=useState('')
  const [email,setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [confirmPassword, setConfirmPassword]= useState('')
  const [errorMessage,setErrorMessage]= useState('')

  const handleSubmit=(e)=>{

   e.preventDefault();

   axios.post(`${BACKEND_URL}/register`,{name,email,password,confirmPassword})
   .then((response)=>{

    console.log("Response from backend:", response.data);

    if(response.data.message === "User registered successfully"){

      
        navigate('/login')
    }
    
   })
   .catch((error)=>{
    if(error.response){
        if(error.response.status === 400){
            if(error.response.data === "Password didn't match"){
                setErrorMessage("Passwords do not match. Please try again")
            }
            else if(error.response.data === "Email already taken"){
                setErrorMessage("Email is already registered. Please try again")
               
            }
            else if(error.response.data.errors){
                const validationErrors = Object.values(error.response.data.errors)
                .map(err => err.message)
                .join(", ");
                setErrorMessage(`validation error:${validationErrors}`)
            } else{
                setErrorMessage("An error occurred. Please check your credentials")
            } 
           
        }
         else if(error.response.status ===500){
            setErrorMessage("Internal server error. Please try agian later")
        } 
        else{
            setErrorMessage("network error. Please try again.")
        }


    }


       
   })

   

  }


  return (
  <div>
    
    <div className='registerbg'style={{backgroundImage:`url(${bgImage})`}}>
    <Navbari  isSignup={true}  />
    <div className="container d-flex justify-content-center align-items-center signupform mt-5  ">
    <form className="w-50 my-5" onSubmit={handleSubmit} >
        <h2 className="text-light">Signup</h2>
        {errorMessage && <div className=' alert alert-danger mt-3'>{errorMessage}</div>}
        <div className="mt-4">
       
            <input type="name" className="form-control" id="name" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div className="mt-3">
            
            <input type="email" className="form-control" id="email" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className="mt-3">
           
            <input type="password" className="form-control" id="password" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <div className="mt-3 mb-3">
          
            <input type="password" className="form-control" id="confirmpassword" placeholder="confirm your password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
        </div>
        <div className="d-grid mb-3">
            <button type="submit" className="btn btn-outline-secondary">Submit</button>
        </div>
       
    </form>
</div>
</div>
</div>
  )
}

export default Register