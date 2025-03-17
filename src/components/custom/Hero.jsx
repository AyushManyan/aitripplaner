 import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import Footer from '@/view-trip/components/Footer'
 
 function Hero (){
  return (
    <div className='flex flex-col items-center mx-4 md:mx-16 lg:mx-56 gap-9'>
      <h1 className='font-extrabold text-3xl md:text-4xl lg:text-[50px] mt-16'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips
      </h1>

      <p className='text-lg md:text-xl text-gray-500 text-center'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>

      <Link to={'/create-trip'}>
        <Button>Get Started</Button>
      </Link>

      <div className='relative w-full h-64 md:h-80 lg:h-96'>
        <div className='absolute mb-10'></div>
        <img src='/image.png' alt='hero' className='w-full h-full object-cover' />
      </div>
      <Footer/>
    </div>
  )
 }
 
 export default Hero