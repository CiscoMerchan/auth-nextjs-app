"use client"
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useRouter} from 'next/navigation';
import Link from 'next/link';

const Profilepage = () => {
  const router = useRouter();
  const [data, setData] = useState("nothing")
  const logOut = async() => {
    try {
      await axios.get('api/users/logout') 
      router.push('/login')
    } catch (error:any) {
      console.log(error.message);
      toast.error(error.message)
    }
  } ;

  const getUserDetail = async () => {
    const res =await axios.get('/api/users/me')
    console.log(res.data);
    setData(res.data.data._id)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py2'>
        <h1 className='text-bold'>Profile</h1>
        <hr />
        <p>Profile page</p>
        <hr />
        <h2 className='p-3 mb-5 rounded bg-green-300 text-black'>
          {data === 'nothing' ? "Nothing": <Link href={`/profile/${data}`}>
        {data}</Link>}</h2>
        <hr />
        {/* logout button  */}
        <button
          onClick={logOut}
         className='bg-blue-500 hover:bg-blue-900
          text-white font-bold py-2 px-4 rounded mt-5'>
            Logout
        </button>
        <hr />
        <button
          onClick={getUserDetail}
         className='bg-purple-500 hover:bg-purple-900
          text-white font-bold py-2 px-4 rounded mt-7'>
            User Detail
        </button>
    </div>
  )
}

export default Profilepage