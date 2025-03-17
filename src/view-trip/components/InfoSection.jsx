import { Button } from '@/components/ui/button';
import { getPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoIosSend } from 'react-icons/io'


const PHOTO_REF_URL = `https://maps.gomaps.pro/maps/api/place/photo?photo_reference={name}&maxwidth=400&key=` + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function InfoSection({ trip }) {
  console.log("trip info", trip);
  const [placeData, setPlaceData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState();


  useEffect(() => {
    trip && getPlacePhoto();
  }, [trip])

  const getPlacePhoto = async () => {
    // console.log("in get place in info photo");
    
    try {
      const destination = trip?.userSelection?.destination;
      if (!destination){
        console.log("no destination");
        return;
        
      };
      console.log("in try block of info");
      console.log("destination", destination);
      
      

      const result = await getPlaceDetails(destination);
      // setPlaceData(result.results[0]);
      console.log("place details", result);
      console.log("place ref", result?.results[0].photos[0].photo_reference);

      const PhotoUrl = PHOTO_REF_URL.replace("{name}", result?.results[0]?.photos[0]?.photo_reference);
      console.log("PhotoUrl info section ", PhotoUrl);
      setPhotoUrl(PhotoUrl);

    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  }

  return (
    <div>
      <img src={photoUrl?photoUrl : '/image.png'} alt="" className='h-[340px] w-full object-cover rounded-lg' />

      <div className='flex justify-between items-center mt-5'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.destination}</h2>
          <div className='flex gap-7'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-400 text-xs md:text-md'>📅 {trip?.userSelection?.noOfDays} Days</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-400 text-xs md:text-md'>💰 {trip?.userSelection?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-400 text-xs md:text-md '>🥂 No. of Traveler {trip?.userSelection?.traveler}</h2>
          </div>
        </div>

        <Button>
          <IoIosSend className='m-2' />

        </Button>

      </div>

    </div>
  )
}

export default InfoSection