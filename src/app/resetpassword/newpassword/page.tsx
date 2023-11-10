"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const UseNewPassword = () => {
    // Initialize router for page navigation
    const router = useRouter();
  
    // State to store the user's new password
    const [userNewPassword, setUserNewPassword] = useState({
      password1: '',
      password2:''
    });
  
     
    // State to control the "Reset Password" button's state
    const [buttonDisable, setButtonDisable] = useState(true);
  
    // State to manage loading state
    const [loading, setLoading] = useState(false);
  
    // STORE TOKEN FROM THE BROWSER
    const [token, setToken] = useState('');
    // to recover and render user name
    



/*################### EMAIL VERIFICATION COMPONET ################ */
// Define the EmailVerification component
  const onClikNewPassword = async () => {
    try {
      setLoading(true);
      console.log('before route' ,userNewPassword)
    //   CHECK IF BOTH INPUT PASSWORDS ARE THE SAME
      if (userNewPassword.password1 !== userNewPassword.password2){
        console.log("both password needs to match", userNewPassword)
        setLoading(false)
        // ADD A MESSAGE FOR THE USER
      }
      // Send a request to the server to check the email
      const response = await axios.post('/api/users/resetpassword/newpassword', {
        password: userNewPassword.password1,
        token: token,
      });

      // Log the result and set the state to activate the "code verification" component 
      console.log('password in db:', response.data);
      
      
      router.push('/login');

    } catch (error: any) {
      
      console.error('Email check failed:', error.message);

      // Display an error toast if email check fails
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

//   GET TOKEN GROM THE BROWSER
useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search);
    const token = urlToken.get("token") || "";
    console.log(token)
    setToken(token);
  }, []);

  // PASSWORDS: Use the useEffect hook to enable/disable the button based on user input
  useEffect(() => {
    setButtonDisable(userNewPassword.password1.length === 0 && userNewPassword.password2.length === 0);
  }, [userNewPassword]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
          <h1 className="font-bold mb-2 items-center justify-center">
            {loading ? 'New Password ...' : 'Reset your password'}
          </h1>
          <hr />
          {/* Confirme new password */}
          <label  htmlFor="newpassword">New Password</label>
          <hr />
          <input
            className="p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none"
            id="newpassword"
            type="text"
            value={userNewPassword.password1}
            onChange={(e) => setUserNewPassword((prevState) => ({
                ...prevState,
                password1: e.target.value,
              }))}
            placeholder="NEW PASSWORD"
          />
          {/* Confirm new password */}
          <hr />
          <label  htmlFor="confirmnewpassword">Confirm New Password</label>
          <hr />
          <input
            className="p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none"
            id="confirmnewpassword"
            type="text"
            value={userNewPassword.password2}
            onChange={(e) => setUserNewPassword((prevState) => ({
                ...prevState,
                password2: e.target.value,
              }))}
            placeholder="CONFIRM NEW PASSWORD"
          />
          <hr />
          <button
            onClick={onClikNewPassword}
            className="p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none hover:bg-black hover:text-white"
            disabled={buttonDisable}
          >
            {buttonDisable ? 'Type your email' : 'Press to get a Code'}
          </button>
          <hr />
          <Link className="mb-3" href="/signup">
            Visit Signup page
          </Link>
        </div>
      
    </div>
  );
};

export default UseNewPassword;
