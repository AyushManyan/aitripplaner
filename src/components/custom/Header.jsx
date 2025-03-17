import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FaUserCheck } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios';



function Header() {

  const [openDailog, setOpenDailog] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  // const navigate = useNavigate();

  const logout = () => {
    googleLogout();
    localStorage.clear();
    window.location.reload();
    // navigate('/')
  }
  const login = useGoogleLogin({

    onSuccess: (codeRes) => GetUserProfile(codeRes),
    onError: (error) => console.log('error', error),
  });

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
      window.location.reload();
    })
  }


  useEffect(() => {
    if (user) {
      console.log('User is logged in', user)
      const pic = user.picture;
      console.log(pic)
    } else {
      console.log('User is not logged in')
    }
  }
    , [user])

  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className='p-3 shadow-sm flex justify-between items-center px-2 flex-wrap bg-white'>
      <img src="/projectlogo.svg" alt="Logo" className='w-24 md:w-32' />
      <button className='md:hidden' onClick={() => setIsNavOpen(!isNavOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <nav className={`flex-col md:flex-row items-center gap-3 md:gap-5 w-full md:w-auto ${isNavOpen ? 'flex' : 'hidden'} md:flex`}>
        {
          user ?
            <div className='flex flex-col md:flex-row items-center gap-3 md:gap-5 w-full md:w-auto'>
              <a href="/" className='text-gray-700 hover:text-primary transition-colors w-full md:w-auto'>
                <Button variant='outline' className='rounded-full w-full md:w-auto'>Home</Button>
              </a>
              <a href="/create-trip" className='text-gray-700 hover:text-primary transition-colors w-full md:w-auto'>
                <Button variant='outline' className='rounded-full w-full md:w-auto'>+Create Trip</Button>
              </a>
              <a href="/my-trips" className='text-gray-700 hover:text-primary transition-colors w-full md:w-auto'>
                <Button variant='outline' className='rounded-full w-full md:w-auto'>My Trips</Button>
              </a>
              <Popover>
                <PopoverTrigger className='none'>
                  <FaUserCheck className="w-5 h-5 flex justify-center items-center rounded-full border-2 border-gray-200 hover:border-primary transition-all" />
                </PopoverTrigger>
                <PopoverContent className='w-auto'>
                  <h2 className='cursor-pointer' onClick={logout}>Logout</h2>
                </PopoverContent>
              </Popover>
            </div>
            :
            <Button onClick={() => setOpenDailog(true)} className='w-full md:w-auto'>Sign In</Button>
        }
      </nav>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src='/projectlogo.svg' className='w-24 md:w-32' />
              <h2 className='font-bold text-xl mt-7'>Sign In with Google</h2>
              <p className='text-gray-500 mt-2'>Sign in to get started</p>
              <Button onClick={login} className='w-full mt-5 flex gap-4 items-center'>
                <FcGoogle style={{ width: '1.5rem', height: '1.5rem' }} />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header