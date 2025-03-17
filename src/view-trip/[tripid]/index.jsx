import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVist from '../components/PlacesToVist';
import Footer from '../components/Footer';

function Viewtrip() {
    const { tripid } = useParams();
    const [trip, setTrip] = useState([]);
    
    useEffect(() => {
        tripid && GetTripData();
    }, [tripid]);

    const GetTripData = async () => {
        const docRef = doc(db, "AITrips", tripid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {

            // console.log("Document data:", docSnap.data());
            setTrip(docSnap.data());
            // console.log("after set trip", trip.trip);
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            toast("No trip Found!!")
        }
    }
    
    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
            {/* information section */}
            <InfoSection trip={trip} />


            {/* recommneded places */}
            <Hotels trip={trip} />


            {/* Daily plan */}
            <PlacesToVist trip={trip} />


            {/* footer */}
            <Footer trip={trip} />


        </div>
    )
}

export default Viewtrip;