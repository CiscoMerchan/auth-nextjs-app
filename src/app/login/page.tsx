'use client';
import React, { useEffect } from 'react'
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import axios from "axios";
import toast from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    password: '',
    
  })

    // Change the state of the login button 
    const [ButtonDisable, setButtonDisable] = React.useState(false);

    // render dynamic title depanding in the activity
    const [loading, setLoading] = React.useState(false)

    // const toastId = toast.loading('Loading...');

  // method to connect to db
  const onLogin = async () => {
    
    try {
      setLoading(true);
      // sending data to the api folder that will manage the logic
      // 1. "api/users/login" is here the `user` data will be manage 
      const response = await axios.post("api/users/login", user);
      // 2. if success data get in to the db and in console the user data created
      console.log("Login success", response.data)
      // 3. after data ok, go to '/profile'
      
      router.push(`/profile`);
    } catch (error:any) {
      console.log("Login failed", error.message);
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  }
    useEffect(() =>{
        if(user.email.length >0 && user.password.length >0){
            setButtonDisable(false);
            console.log('false');
        } else { setButtonDisable(true);
          console.log('true')
        }
    },[user])  
  
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py2'> 
      <h1 className='font-bold'>{loading? "Loading ..." : "Login"}</h1>
      <hr />
      
      <label htmlFor='email'>email</label>
      <input
        className='p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none'
        id='email'
        type='text'
        value={user.email}
        onChange={(e) => setUser({...user, email: e.target.value})}
        placeholder='email'
      />
      <label htmlFor='password'>password</label>
      <input
        className='p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none'
        id='password'
        type='text'
        value={user.password}
        onChange={(e) => setUser({...user, password: e.target.value})}
        placeholder='password'
      />
      <button 
      onClick={onLogin}  
      className='p-4 border border-gray-300
       rounded-lg mb-4 focus:outline-none hover:bg-black hover:text-white'>
        {ButtonDisable? 'Type your email and password':'Login here'}
      </button>
      <Link href='/signup'>Visit Signup page</Link>
    </div>
  )
  }      

export default LoginPage