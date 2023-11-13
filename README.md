# Next.js ResetPassword App

  This repository showcases a Next.js application that I independently developed, drawing inspiration from a YouTube tutorial to deepen my understanding and proficiency in the Next.js framework as part of my ongoing journey with React.js. The initial commit aligns with the tutorial content, serving as a foundation, while the `ResetPassword` branch stands as a testament to my unique contributions and enhancements.


## Cloning and Installation

To clone and install this app on your computer, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/CiscoMerchan/auth-nextjs-app.git
```

2. Navigate to the project directory:

```bash
cd auth-nextjs-app
```

3. Install the required dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

## ResetPassword Branch

The 'ResetPassword' branch introduces functionality to allow users to change their passwords in case the user has forgotten its password.

### Client-Side Workflow

1. On `/login`, the user clicks on the "forgot password" button.

2. `/resetpassword/emailverification/page.tsx`. The `EmailVerification` component manages two subcomponents: `checkEmail` and `checkCode`. The activation of each depends on `const [codeVerification, setCodeVerification] = useState(false);`:

```jsx
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
          // render CODE input
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
      const response = await axios.post('/api/users/resetpassword/checkcodeuser', userCode);

      // Log the result and set the state to activate the "code verification" component 
      console.log('CODE checked:', response.data);
      router.push('/resetpassword/newpassword') 
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
            {loading ? 'Verifying code ...' : `Hi Type your code`}
          </h1>  
          <hr />
          <p> You have received and email with a code valid for 1 hour.</p> 
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
            {buttonDisable ? 'Type your Code' : 'Reset your password'}
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
            {loading ? 'Sending email ...' : 'Forgot Password? Get a code!'}
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
            {buttonDisable ? 'Type your email' : 'Press to get a Code'}
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

```

3. User receives an email with a number CODE.

4. User inserts CODE, clicks on `reset password` button.

5. `src/app/resetpassword/newpassword/page.tsx`. The user inserts a new password two times. This page before `POST` the data to the route.ts file, verifies that the two entered passwords are the same and fetches the `token` from the client:

```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/users/me');
      console.log('user ID', res.data.data._id);
      setClientToken(res.data.data._id);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData(); // Call the async function inside useEffect
}, []);
```

7. User is then redirected to the `/login` page and gains access to their account.

### Server-Side Workflow

- `/api/users/resetpassword/checkemailuser/route.ts`. This file's goal is to take the user's email and verify that the user is in the database.

- Once the user is found in the database, the script generates a CODE (a random number between 100000 and 999999).

- CODE and an ExpiryDate of the CODE are inserted into the DB and sent to the user by email (for the email, 'mailtrap' is used, as in the original code).

- User inserts CODE on click, `/api/users/resetpassword/checkcodeuser/route.ts`. CODE and ExpiryDate of the CODE are checked in the DB. If `true`, the script generates `tokenData` with `user.id` and `user.name`, encrypts the `tokenData`, and the `Token` is injected into the browser as cookies. `Token` and `expiryTokenDate` are inserted into the DB.

- User inserts a new password, `/api/users/resetpassword/newpassword/route.ts`. First, verify that the password and confirm password are the same. Confirm that the user ID is in the database. Hash the new user password, and the user password is updated with the new password.

#### What I Learn

- Difference between Server and Client components.

- How `useEffect` Hook works.

- Concept of Token and Cookies.

- Authentication/User verification.

- Middleware in Next.js.

- Helpers file.

- TypeScript.

- API integration with third parties.

- Handling query requests from the URL.

- Communication between server and client components through APIs.

- Enhance my debbuging with DevTools

#### Libraries and Dependencies

- `axios`
- `bcryptjs`
- `jsonwebtoken`
- `mongoose`
- `next`
- `nodemailer`

### Any comments or suggestions are very welcome.

