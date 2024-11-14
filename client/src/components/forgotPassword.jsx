import React from 'react'
import Navbari from './navbari'
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate=useNavigate()
  return (
    <div>
    <div className='registerbg'>
        <Navbari />
        <div className="container d-flex justify-content-center align-items-center signupform  " style={{marginTop:"100px"}} >
            <form className="w-50 my-5" >
                <h2 className="  text-light">Forgot Password</h2>

                <div className="mt-4">

                    <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                </div>
              
                <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-outline-secondary" onClick={()=>navigate('/resetpassword2.0')}>Submit</button>
                </div>
               

            </form>
        </div>
    </div>

</div>
  )
}

export default ForgotPassword;