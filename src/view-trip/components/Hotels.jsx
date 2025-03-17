import React from 'react'
import { Link } from 'react-router-dom';
import HotelCardItem from './HotelCardItem';

function Hotels(trip) {
  // console.log("trip hotel", trip);
  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8'>

        {trip?.trip?.tripData?.hotels?.map((hotel, index) => (

          <HotelCardItem key={index} hotel={hotel} />

        ))}

      </div>

    </div>
  )
}

export default Hotels