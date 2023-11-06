'use client';
import React, { useEffect } from 'react'
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import axios from "axios";
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    password: '',
    username:'',
  })

  // Change the state of the signup button 
  const [ButtonDisable, setButtonDisable] = React.useState(false);

  // render dynamic title depanding in the activity
  const [loading, setLoading] = React.useState(false)

  // method to connect to db
  const onSignup = async () => {
    try {
      setLoading(true);
      // sending data to the api folder that will manage the logic
      // 1. "api/users/signup" is here the `user` data will be manage 
      const response = await axios.post("api/users/signup", user);
      // 2. if success data get in to the db and in console the user data created
      console.log("Signup success", response.data)
      // 3. after data ok, go to '/login'
      router.push("/login");
    } catch (error:any) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  }

  /* To activate signup button once the user have type data 
  in the inputs of the form */
  useEffect(() => {
    if(user.email.length > 0 &&
       user.password.length > 0 &&
        user.username.length > 0) {
          setButtonDisable(true)
        }
  }, [user]) 

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py2'> 
      <h1 className='font-bold'>{loading ? "Loading" : "SignUp"}</h1>
      <hr />
      <label htmlFor='username'>username</label>
      <input
        className='p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none'
        id='username'
        type='text'
        value={user.username}
        onChange={(e) => setUser({...user, username: e.target.value})}
        placeholder='username'
      />
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
      onClick={onSignup}  
      className='p-4 border border-gray-300
       rounded-lg mb-4 focus:outline-none hover:bg-black hover:text-white'>
        {ButtonDisable ?  "Signup here" : "compleate the cases"}
      </button>
      
      <Link href='/login'>Visit login page</Link>
    </div>
  )
}

export default SignUpPage