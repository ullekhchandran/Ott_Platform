import React from 'react'
import Navbar from './navbar';
import Plancard from './plancard';
import CustomIcons from './pagination';
function Plans() {
    const name = ['Basics']
    const price = ['$5.55']
    const duration = ['1 month']


    const plans = [
        { name: 'Basic', price: '$5.55', duration: '1 month',date:"23/08/2023" },
        { name: 'Gold', price: '$8.88', duration: '3 months',date:"2/11/2023" },
        { name: 'Platinum', price: '$9.99', duration: '6 months', date:"10/07/2023" },
     
    ]

    return (
        <div className='plans  '>
            <Navbar />
            <div className='container mt-4' style={{ maxWidth: "500px"}}>
                <h3 className='text-light d-flex justify-content-center mt-5 mb-4'>User's plan</h3>
                <Plancard planname={name} price={"$5.55"} duration={duration} />
               
                <div className='mt-5 pb-5' >
                <table className='table table-dark table-bordered'>
                   <thead>
                    <tr>
                        
                        <th>Date</th>
                        <th >plan</th>
                    </tr>
                   </thead>
                   <tbody> 
                    {plans.map((plan,index)=>(
                        <tr key={index}>
                            <td>{plan.date}</td>
                            <td>{plan.name}</td>

                        </tr>
                    ))}
                       
                   </tbody>
                </table>

                </div>

         
            </div>
            <div className='d-flex justify-content-center py-2'>
                <CustomIcons />
            </div>
           

        </div>
    )
}

export default Plans;