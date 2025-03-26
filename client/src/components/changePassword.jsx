import React from 'react'
import Navbar from './navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useState } from 'react'


function ChangePassword() {
    const navigate = useNavigate()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [validationErrors, setValidationErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();


        const userData = { currentPassword, newPassword, confirmPassword }
        console.log(userData)
        axios.post(`${BACKEND_URL}/changepassword`, userData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }

        })
            .then((response) => {


                navigate('/login')


            })
            .catch((error) => {
                setErrorMessage('');
                setValidationErrors([]);
                if (error.response && error.response.status === 400) {

                    const { message, errors } = error.response.data;

                    if (message === "USER NOT FOUND") {
                        setErrorMessage('Use not found!')
                    }
                    else if (message === "Current password is incorrect") {
                        setErrorMessage('Current password is incorrect .Please try again')
                    }
                    else if (message === "newPassword and confirmPassword didnt match") {
                        setErrorMessage('newPassword and confirmPassword didnt match')
                    }
                    else if (errors) {

                        // Extract and format validation error messages
                        const formattedErrors = Object.values(errors)
                            .map(err => err.message)
                            .join(", ");
                        setValidationErrors(formattedErrors.split(", ")); // Store as an array
                    }

                }

            })

    }



    return (
        <div>
            <div className='registerbg '>
                <Navbar />
                <div className="container d-flex justify-content-center align-items-center signupform  " style={{ marginTop: "100px" }} >
                    <form className="w-50 my-5" onSubmit={handleSubmit} >
                        <h2 className="  text-light fs-sm-1 text-center " >Change Password</h2>

                        <div className="mt-4">

                            <input type="password" className="form-control" id="currentpassword" placeholder="currentpassword" onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>

                        <div className="mt-4">

                            <input type="password" className="form-control" id="newpassword" placeholder="newpassword" onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="mt-4">

                            <input type="password" className="form-control" id="confirmpassword" placeholder="confirmpassword" onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>



                        {errorMessage && <p className='text-danger mt-3'>{errorMessage}</p>}

                        {validationErrors.length > 0 && (
                            <ul className='text-danger mt-3'>
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        )}
                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-outline-secondary" >Submit</button>
                        </div>


                    </form>
                </div>
            </div>

        </div>
    )
}

export default ChangePassword;