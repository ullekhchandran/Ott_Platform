import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate= useNavigate();

  const logout=()=>{
    localStorage.removeItem('token');
    navigate('/login');
  }


  return (
    <div className='navbarbg'>
    <nav className="navbar navbar-expand-lg" >
        <div className="container-fluid  " >
          <a className="navbar-brand text-light  fs-2 fw-bold ps-lg-5 " href="/home">theAter</a>
          <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse px-lg-5 " id="navbarSupportedContent" >
            <ul className="navbar-nav  mb-2 mb-lg-0 ">
              <li className="nav-item me-3">
                <a className="nav-link active text-light" aria-current="page" href="/plans">Plans</a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-light" href="/subscribe">subscribe</a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-light" href="/changepassword">Change Password</a>
              </li>
             
              <li className="nav-item me-3" >
                <a className="nav-link text-light " href="/watchlater" >Watchlater </a>
              </li>
             
              <li className="nav-item " >
                <a className="nav-link text-light " href="/watchhistory" >Watchhistory </a>
              </li>
             
            </ul>
            <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
            <li className="nav-item ">
                <a className="nav-link text-danger " href="#" onClick={logout}>Logout</a>
              </li>

            </ul>
        
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Navbar