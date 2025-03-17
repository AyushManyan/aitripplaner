import React from 'react';
import PlaceCardItmes from './PlaceCardItmes';

function PlacesToVisit({ trip }) {
    // console.log("trip places in hotel", trip);

    const tripData = trip?.tripData;
    // console.log("trip data", tripData);


    if (!tripData) {
        // console.log("in if");

        return <p>No trip data available.</p>;
    }

    return (
        <div className='mt-14'>
            <h1 className="font-bold font-serif text-2xl mb-4">Trip Details</h1>

            {/* Display Best Time to Visit */}
            {tripData.bestTimetoVisit && (
                <div className="mb-6">
                    <h2 className="font-semibold text-xl">Best Time to Visit</h2>
                    <p className="text-gray-700 font-serif">{tripData.bestTimetoVisit}</p>
                </div>
            )}

            {/* Display Itinerary */}
            {tripData.itinerary ? (
                <div className='mt-5' >
                    {Object.keys(tripData.itinerary).sort((a, b) => {
                        const dayA = parseInt(a.replace('day', ''));
                        const dayB = parseInt(b.replace('day', ''));
                        return dayA - dayB;
                    }).map((day, dayIndex) => (
                        <div key={dayIndex} >

                            <h3 className="font-bold text-lg mb-3 ">{day.charAt(0).toUpperCase()+day.slice(1)}</h3>
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {tripData.itinerary[day].map((place, placeIndex) => (
                                    <div key={placeIndex} className="">
                                        <h2 className='font-medium text-sm '>Spend time <span className='text-orange-600'>⌛ {place.timeToSpend}</span></h2>
                                        <PlaceCardItmes place={place} />

                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No itinerary available.</p>
            )}
        </div>
    );
}

export default PlacesToVisit;
