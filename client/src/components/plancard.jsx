import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
function Plancard({planname,price,duration}) {
  return (
    <div >
        <div className='card plancard animate-card '  style={{ cursor: 'pointer' }} >
            <div className='card-body'>
                <div className='card-title '>
                    <h4 > {planname}</h4>
                    <ul className='list-unstyled mt-3 '>
                        <li className='card-text '>
                            <h6 className='display-3'> {price}</h6>
                        </li>
                        <li className='card-text mt-3'>
                                <i className='bi bi-check-circle-fill text-success me-3 mb-2'></i>
                               {duration}

                        </li>
                        <li className='card-text mt-3 '>
                                <i className='bi bi-check-circle-fill text-success me-3 mb-2'></i>
                                24/7 support

                        </li>
                        <li><a href="" className='btn btn-outline-light mt-3 '>Get started</a></li>
                       
                    </ul>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Plancard