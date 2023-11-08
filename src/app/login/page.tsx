'use client';
import React, { useEffect } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; 
import axios from "axios";
import toast from 'react-hot-toast';

// Define the LoginPage component
const LoginPage = () => {
  const router = useRouter();
  
  // State to store user input
  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  // State to control the login button's state
  const [ButtonDisable, setButtonDisable] = React.useState(false);

  // State to manage the dynamic title
  const [loading, setLoading] = React.useState(false);

  // Method to handle user login
  const onLogin = async () => {
    try {
      setLoading(true);
      // Sending data to the API endpoint for user login
      const response = await axios.post("api/users/login", user);
      // If successful, log the user data and redirect to the profile page
      console.log("Login success", response.data);
      router.push(`/profile`);
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.message); // Display an error toast
    } finally {
      setLoading(false);
    }
  }

  // Update the button state based on user input
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisable(false); // Enable the button if both email and password are provided
      console.log('false');
    } else {
      setButtonDisable(true); // Disable the button if either field is empty
      console.log('true');
    }
  }, [user]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'> 
      <h1 className='font-bold'>{loading ? "Loading ..." : "Login"}</h1>
      <hr />
      
      {/* Input field for email */}
      <label htmlFor='email'>email</label>
      <input
        className='p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none'
        id='email'
        type='text'
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder = 'email'
      />

      {/* Input field for password */}
      <label htmlFor='password'>password</label>
      <input
        className='p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none'
        id='password'
        type='text'
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder = 'password'
      />

      {/* Login button */}
      <button
        onClick={onLogin}
        className='p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none hover:bg-black hover:text-white'>
        {ButtonDisable ? 'Type your email and password' : 'Login here'}
      </button>

      {/* Link to the signup page */}
      <Link href='/signup'>Visit Signup page</Link>
      <hr />
      {/* Link to the "Forgot Your Password" page */}
      <Link className='mt-4 hover:text-blue-800' href='/resetpassword/emailverification'>Forgot Your Password?</Link>
    </div>
  );
}

export default LoginPage;
