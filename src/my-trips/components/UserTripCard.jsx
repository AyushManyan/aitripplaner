import { getPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCard(trip) {

    const [photoUrl, setPhotoUrl] = useState();
    const [placeData, setPlaceData] = useState(null);


    useEffect(() => {
        trip && getPlacePhoto();
    }, [trip])

    const getPlacePhoto = async () => {
        try {
            const destination = trip?.trip?.userSelection?.destination;
            if (!destination) return;

            const result = await getPlaceDetails(destination);
            setPlaceData(result.results[0]);
            // console.log("place details", result);
            // console.log("place ref", result?.results[0].photos[0].photo_reference);

            const PhotoUrl = PHOTO_REF_URL.replace("{name}", result?.results[0]?.photos[0]?.photo_reference);
            // console.log("PhotoUrl", PhotoUrl);
            setPhotoUrl(PhotoUrl);

        } catch (error) {
            console.error("Error fetching place photo:", error);
        }
    }

    return (
        <Link to={'/view-trip/' + trip?.trip?.id} className='hover:scale-105 transform transition duration-300 ease-out cursor-pointer hover:shadow-lg'>
            <div className='w-full max-w-sm mx-auto'>
                <div className='relative'>
                    <img src={photoUrl ? photoUrl : "/image.png"} alt="" className='rounded-xl h-[180px] w-full object-cover' />
                    {!photoUrl && (
                        <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-xl'></div>
                    )}
                </div>
                <div className='mt-4'>
                    <h2 className='font-bold text-lg'>{trip?.trip?.userSelection?.destination}</h2>
                    <h2 className='font-medium text-xs'>{trip?.trip?.userSelection?.noOfDays} Days trip with {trip?.trip?.userSelection?.budget} Budget</h2>
                </div>
            </div>
        </Link>
    )
}

export default UserTripCard