import React from 'react'
import Navbar from './navbar';
import Plancard from './plancard';
import CustomIcons from './pagination';

function Subscribe() {
  const planname = ['Basic', 'Gold', 'Platinum']
  const price = ['$5.55', '$8.88', '$9.99']
  const duration = ['1 month', '3 month', "6 month"]
  return (
    <div className='subscribe '>
      <Navbar />
      <h1 className=' text-light d-flex justify-content-center mt-5 '>Subscribe</h1>
      <div className='container  '>
        <div className=' row  mt-4 rounded-4 ' >
          {planname.map((name, index) => (

            <div className='col-lg-4 col-md-6 col-sm-12 mt-4' key={index}>
              <Plancard planname={name} price={price[index]} duration={duration[index]} />
            </div>

          ))}


        </div>
      </div>
      <div className='d-flex justify-content-center py-5'>
                <CustomIcons />
            </div>
    </div>
  )
}

export default Subscribe;
