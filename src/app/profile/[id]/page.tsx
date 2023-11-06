import React from 'react'

const UserProfile = ({params}:any) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py2'>
        <h1 className='text-bold'>Profile</h1>
        <hr />
        <p className='text-4xl'>Profile page {params.id}</p>
    </div>
  )
}

export default UserProfile