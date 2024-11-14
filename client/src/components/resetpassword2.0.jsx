import React from 'react'
import Navbari from './navbari'
import { useNavigate } from 'react-router-dom'

function Resetpassword() {
    const navigate= useNavigate()

  return (
    <div>
    <div className='registerbg'>
        <Navbari />
        <div className="container d-flex justify-content-center align-items-center signupform  " style={{marginTop:"100px"}} >
            <form className="w-50 my-5" >
                <h2 className="  text-light">Reset Password</h2>

                <div className="mt-4">

                    <input type="password" className="form-control" id="newpassword" placeholder="newpassword" />
                </div>
                <div className="mt-4">

                    <input type="password" className="form-control" id="password" placeholder="confirm password" />
                </div>
              
                <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-outline-secondary" onClick={()=>{navigate('/login')}}>Submit</button>
                </div>
             

            </form>
        </div>
    </div>

</div>
  )
}

export default Resetpassword;