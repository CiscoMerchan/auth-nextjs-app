"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const EmailVerification = () => {
    // Initialize router for page navigation
    const router = useRouter();
  
    // State to store the user's email
    const [userEmail, setUserEmail] = useState({
      email: '',
    });
  
    // State to store the user's email
    const [userCode, setUserCode] = useState({
      code: '',
    });
  
    // State to control the "Reset Password" button's state
    const [buttonDisable, setButtonDisable] = useState(true);
  
    // State to manage loading state
    const [loading, setLoading] = useState(false);
  
    // State to track whether to navigate to the code verification
    const [codeVerification, setCodeVerification] = useState(false);



/*################### EMAIL VERIFICATION COMPONET ################ */
// Define the EmailVerification component
  const checkEmail = async () => {
    try {
      setLoading(true);
      console.log('before route' ,userEmail)
      // Send a request to the server to check the email
      const response = await axios.post('/api/users/resetpassword/checkemailuser', userEmail);

      // Log the result and set the state to activate the "code verification" component 
      console.log('Email checked:', response.data);
      setCodeVerification(true);
    } catch (error: any) {
      
      console.error('Email check failed:', error.message);

      // Display an error toast if email check fails
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

/*################### CODE VERIFICATION COMPONET ################ */  
   // Function to check the user's CODE for password reset
   const checkCode = async () => {
    try {
      setLoading(true);

      // Send a request to the server to check the code
      const response = await axios.post('api/users/checkcodeuser', userCode);

      // Log the result and set the state to activate the "code verification" component 
      console.log('CODE checked:', response.data);
      router.push('/') /*ADD ROUTE TO RESET PASSWORD PAGE */
    } catch (error: any) {
      console.error('CODE check failed:', error.message);

      // Display an error toast if CODE check fails
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // EMAIL: Use the useEffect hook to enable/disable the button based on user input
  useEffect(() => {
    setButtonDisable(userEmail.email.length === 0);
  }, [userEmail]);

  // CODE: Use the useEffect hook to enable/disable the button based on user input
  useEffect(() => {
    setButtonDisable(userCode.code.length === 0);/* CHANGE THE LENGHT TO 6(6 DIGITS CODE) */
  }, [userCode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {codeVerification ? (
        /* If codeVerification is true Display the code verification input 
        in this wait the user can type the code received on their email to reset 
        their password*/
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
          <h1 className="text-lg font-bold mb-2">
            {loading ? 'Verifying code ...' : 'Type your code'}
          </h1>  
          <hr />
          <p>You have received and email with a code valid for 1 hour.</p> 
          <p>Type your code below to reset your password.</p>
            
          <hr />
          <label className='m-2 text-lg' htmlFor="code">CODE</label>
          <hr />
          <input
            className="p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none placeholder:text-gray-500 placeholder:italic placeholder:uppercase w-96 px-5 placeholder:text-center"
            id="code"
            type="text"
            value={userCode.code}
            onChange={(e) => setUserCode({ code: e.target.value })}
            placeholder="CODE"
          />
          <hr />
          <button
            onClick={checkCode}
            className="p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none hover:bg-black hover:text-white"
            disabled={buttonDisable}
          >
            {buttonDisable ? 'Type your email' : 'Reset your password'}
          </button>
          <hr />
          <Link className="mb-3" href="/signup">
            Visit Signup page
          </Link>
        </div>  
        
      ) : (
        // Display email user form to verify email
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
          <h1 className="font-bold mb-2 items-center justify-center">
            {loading ? 'Sending email ...' : 'Forgot Password? Reset your password!'}
          </h1>
          <hr />
          <label  htmlFor="email">Email</label>
          <hr />
          <input
            className="p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none"
            id="email"
            type="text"
            value={userEmail.email}
            onChange={(e) => setUserEmail({ email: e.target.value })}
            placeholder="Email"
          />
          <hr />
          <button
            onClick={checkEmail}
            className="p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none hover:bg-black hover:text-white"
            disabled={buttonDisable}
          >
            {buttonDisable ? 'Type your email' : 'Reset your password'}
          </button>
          <hr />
          <Link className="mb-3" href="/signup">
            Visit Signup page
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
