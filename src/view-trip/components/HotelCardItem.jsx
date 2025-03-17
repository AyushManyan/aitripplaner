import { getPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HotelCardItem({ hotel, index }) {

      const [placeData, setPlaceData] = useState(null);
      const [photoUrl, setPhotoUrl] = useState();
    
    
      useEffect(()=>{
        hotel&& getPlacePhoto();
      },[hotel])
    
      const getPlacePhoto = async () => {
        try {
          const destination = hotel?.hotelName;
          if (!destination) return;
    
          const result = await getPlaceDetails(destination);
          setPlaceData(result?.results[0]);
          console.log("place details", result);
          // console.log("place ref", result?.results[0].photos[0].photo_reference);
          
          const PhotoUrl = PHOTO_REF_URL.replace("{name}", result?.results[0]?.photos[0]?.photo_reference);
          console.log("PhotoUrl", PhotoUrl);
          setPhotoUrl(PhotoUrl);
    
        } catch (error) {
          console.error("Error fetching place photo:", error);
        }
      }


    return (
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotelName + "," + hotel?.hotelAddress} target='_blank' rel='noreferrer noopener' className='hover:scale-105 transform transition duration-300 ease-out cursor-pointer hover:shadow-lg'>
        <div key={index} className='hover:scale-105 transform transition duration-300 ease-out cursor-pointer hover:shadow-lg'>
          <div className='relative'>
            {!photoUrl && (
              <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-xl'></div>
            )}
            <img src={photoUrl ? photoUrl : '/image.png'} alt="" className={`rounded-xl h-[180px] w-full object-cover ${!photoUrl ? 'opacity-0' : ''}`} />
          </div>

          <div className='my-2 flex flex-col gap-2'>
            <h2 className='font-medium text-lg md:text-xl'>{hotel?.hotelName}</h2>
            <h2 className='text-xs md:text-sm text-gray-500'>📍 {hotel?.hotelAddress}</h2>
            <h2 className='text-sm md:text-base'>💰 {hotel?.priceRange}</h2>
            <h2 className='text-sm md:text-base'>⭐ {hotel?.rating}</h2>
          </div>

        </div>
      </Link>
    )
}

export default HotelCardItem