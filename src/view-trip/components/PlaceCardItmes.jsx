import { Button } from '@/components/ui/button'
import { getPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

function PlaceCardItmes(place) {


    const [placeData, setPlaceData] = useState(null);
      const [photoUrl, setPhotoUrl] = useState();
    
    
      useEffect(()=>{
        place&& getPlacePhoto();
      },[place])
    
      const getPlacePhoto = async () => {
        try {
          const destination = place?.place?.placeName;
          if (!destination) return;
    
          const result = await getPlaceDetails(destination);
          setPlaceData(result.results[0]);
          // console.log("place details", result);
          // console.log("place ref", result?.results[0].photos[0].photo_reference);
          
          const PhotoUrl = PHOTO_REF_URL.replace("{name}", result?.results[0]?.photos[0]?.photo_reference);
          console.log("PhotoUrl", PhotoUrl);
          setPhotoUrl(PhotoUrl);
    
        } catch (error) {
          console.error("Error fetching place photo:", error);
        }
      }
    


    return (

        <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.place?.placeName} target='_blank' rel='noreferrer noopener' className='hover:scale-105 transform transition duration-300 ease-out cursor-pointer hove:shadow-lg'>
            <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:shadow-lg hover:scale-105 transform transition duration-300 ease-out cursor-pointer'>
                <img src={photoUrl?photoUrl:'/image.png'} alt="" className='rounded-xl w-[150px] h-[150px] object-cover' />

                <div className='flex flex-col gap-2'>
                    <h2 className='font-bold text-xl '>{place?.place?.placeName}</h2>
                    <h2 className='text-gray-500'>🛈 {place?.place?.placeDetails}</h2>
                    <h2 className='font-semibold'>🎫 {place?.place?.ticketPricing}</h2>
                    <h2 className=''>⭐ {place?.place?.rating}</h2>

                    {/* <Button size='sm'>
                <FaMapLocationDot className='text-white'/>
            </Button> */}
                </div>



            </div>
        </Link>
    )
}

export default PlaceCardItmes