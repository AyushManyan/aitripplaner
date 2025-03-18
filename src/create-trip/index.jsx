import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectedBuggetOptions, SelectedTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FcGoogle } from 'react-icons/fc'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import Footer from '@/view-trip/components/Footer';
import { Helmet } from 'react-helmet';



const fetchAutocompleteSuggestions = async (input) => {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  const response = await fetch(`https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`);
  const data = await response.json();
  console.log("API Response:", data); // Debugging line

  if (data.status === "ZERO_RESULTS") {
    return [];
  }

  return data.predictions.map(prediction => ({
    label: prediction.description,
    value: prediction.place_id,
  }));
};

const CreateTrip = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  const [openDailog, setOpenDailog] = useState(false);
  const [formData, setFormData] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleInputChange = async (event) => {
    const input = event.target.value;
    setInputValue(input);
    if (input) {
      try {
        const results = await fetchAutocompleteSuggestions(input);
        setSuggestions(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange1 = (key, value) => {

    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedValue(suggestion);
    setInputValue(suggestion.label);
    setSuggestions([]);

  };

  useEffect(() => {
    console.log('formData', formData)
  }, [formData]);


  const login = useGoogleLogin({

    onSuccess: (codeRes) => GetUserProfile(codeRes),
    onError: (error) => console.log('error', error),
  });


  const OnGenerateTrip = async () => {


    const user = localStorage.getItem('user')
    if (!user) {
      setOpenDailog(true)
      return;
    }

    if (formData?.noOfDays > 5) {
      toast('Please select no of days less than 5')
      return
    }
    if (!formData?.noOfDays) {
      toast('Please select no of days')
      return
    }
    if (!formData?.destination) {
      toast('Please select destination')
      return
    }
    if (!formData?.budget) {
      toast('Please select budget')
      return
    }
    if (!formData?.traveler) {
      toast('Please select traveler')
      return
    }

    setLoading(true)
    const FINAL_PROMT = AI_PROMPT.replace('{destination}', formData?.destination).replace('{totalDays}', formData?.noOfDays).replace('{traveler}', formData?.traveler).replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays)
    console.log('FINAL_PROMT', FINAL_PROMT);

    const result = await chatSession.sendMessage(FINAL_PROMT);
    console.log('result', result?.response?.text());
    setLoading(false)
    SaveAiTrip(result?.response?.text())

  }


  const SaveAiTrip = async (tripData) => {
    try {
      setLoading(true);
      const docId = Date.now().toString();
      const user = JSON.parse(localStorage.getItem('user'));

      const tripDoc = {
        userSelection: formData,
        tripData: JSON.parse(tripData),
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'AITrips', docId), tripDoc, {
        merge: true
      });

      toast.success('Trip saved successfully!');
      navigate('/view-trip/' + docId);
      return docId;
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error('Failed to save trip. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'

      }
    }).then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data))
      console.log('res', res.data)
      setOpenDailog(false)
      OnGenerateTrip();
    })
  }



  return (


    <>

      <Helmet>
        {/* Page Title */}
        <title>Plan Your Perfect Trip | AI-Powered Itinerary Generator - WanderIQ</title>

        {/* Meta Description for SEO */}
        <meta name="description" content="Tell us your travel preferences, and our AI trip planner will generate a customized itinerary tailored to your interests, budget, and companions." />

        {/* Relevant SEO Keywords */}
        <meta name="keywords" content="AI Trip Planner, Custom Travel Itinerary, Budget Travel, Smart Travel Planning, Personalized Travel Recommendations" />

        {/* Open Graph (OG) Tags for Social Media Preview */}
        <meta property="og:title" content="Plan Your Perfect Trip | WanderIQ" />
        <meta property="og:description" content="Create personalized AI-generated itineraries based on your travel preferences, budget, and companions." />
        <meta property="og:image" content="/projectlogo.svg" />
        <meta property="og:url" content="https://wanderiq.com/trip-planner" />

        {/* Canonical URL to Avoid Duplicate Content Issues */}
        <link rel="canonical" href="https://wanderiq.com/trip-planner" />
      </Helmet>


      <div className="p-6 bg-gray-100 min-h-screen mt-10 w-[90%] mx-auto rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold text-gray-800 mb-6">Tell us your travel preferences.🏕️🌴</h1>
        <p className="text-lg text-gray-700 mb-6">Information, and our trip planner will generate a customized itinerary based on your preferences.</p>

        <div className='mt- flex flex-col gap-10'>
          <div>
            <h2 className='text-2xl my-3 font-semibold text-gray-800'>What is your destination of choice?</h2>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter a destination"
              className="autocomplete-input w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ul className="autocomplete-suggestions mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
              {suggestions.length === 0 && inputValue && (
                <li className="p-2 text-gray-500">No suggestions found</li>
              )}
              {suggestions.map(suggestion => (
                <li
                  key={suggestion.value}
                  onClick={() => {
                    handleSuggestionClick(suggestion);
                    handleInputChange1('destination', suggestion.label);
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className='text-2xl my-3 font-semibold text-gray-800'>
              How many days are you planning your trip?
            </h2>
            <Input className="autocomplete-input w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={'Ex.3'} type='number' onChange={(e) => {
              handleInputChange1('noOfDays', e.target.value)
            }} />
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5'>
            {SelectedBuggetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange1('budget', item.title)}
                className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer  ${formData.budget === item.title && 'bg-blue-100 border-black shadow-lg'}`}>
                <h2 className='text-3xl'>{item.icons}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h6 className='text-sm text-gray-500'>{item.desc}</h6>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5'>
            {SelectedTravelesList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange1('traveler', item.people)}
                className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer  ${formData.traveler === item.people && 'bg-blue-100 border-black shadow-lg'}`}>
                <h2 className='text-3xl'>{item.icons}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h6 className='text-sm text-gray-500'>{item.desc}</h6>
              </div>
            ))}
          </div>
        </div>

        <div className='my-10 justify-end flex'>
          <Button disabled={loading} onClick={OnGenerateTrip}>
            {loading ? <AiOutlineLoading3Quarters className='animate-spin' style={{ width: '1.5rem', height: '1.5rem' }} /> : 'Generate Trip'}
          </Button>
        </div>

        <Dialog open={openDailog}>

          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src='/projectlogo.svg' />
                <h2 className='font-bold text-xl mt-7'>Sign In with Google</h2>
                <p className='text-gray-500 mt-2'>Sign in to get started</p>

                <Button

                  onClick={login}
                  className='w-full mt-5 flex gap-4 items-center'>

                  <FcGoogle style={{ width: '1.5rem', height: '1.5rem' }} />
                  Sign In with google

                </Button>

              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>

    </>
  );
};

export default CreateTrip;