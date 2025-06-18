/* eslint-disable @typescript-eslint/no-unused-vars */
import Profile from '@/components/forms/Profile';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server'
import React, { Suspense } from 'react'

const page = async () => {
  const {userId} = await auth();

  if(!userId) return null;

  const mongoUser = await getUserById({userId});

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>

      <div className='mt-9'>
        <Suspense fallback={<div>Loading Profile...</div>}>
          <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
        </Suspense>
      </div>
    </>
  )
}

export default page
