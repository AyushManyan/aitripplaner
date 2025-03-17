import { db } from '@/service/firebaseConfig';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import UserTripCard from './components/UserTripCard';
import '../index.css';
import Footer from '@/view-trip/components/Footer';

function MyTrips() {
    const navigate = useNavigation();
    const [userTrip, setUserTrip] = useState([]);

    useEffect(() => {
        GetuserTrip();
    }, [])
    const GetuserTrip = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("user in my trips", user);

        console.log('user email', user.email);


        if (!user) {
            navigate('/')
            return
        }


        const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
        const querySnapshot = await getDocs(q);
        setUserTrip([]);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            setUserTrip(preVal => [...preVal, doc.data()])
        });

    }
    return (
        <div className='sm:px-10 md:px-32 ld:px-56 xl:px-72 px-5 mt-20'>
            <h2 className='font-bold text-3xl'>My Trips</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 pb-10'>
                {userTrip?.length > 0 ? userTrip.map((trip, index) => (
                    <UserTripCard key={index} trip={trip} />
                ))
                    :
                    [1, 2, 3, 4, 5, 6].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-48 bg-gray-300 rounded-md"></div>
                        </div>
                    ))

                }
            </div>
            <Footer />
        </div>
    )
}

export default MyTrips