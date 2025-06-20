import Question from '@/components/forms/Question'
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server'
import React, { Suspense } from 'react'

const page = async ({params}: ParamsProps) => {
  const {userId} = await auth();

  if(!userId) return null;

  const mongoUser = await getUserById({userId});
  const result = await getQuestionById({questionId: params.id})

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>

      <div className='mt-9'>
        <Suspense fallback={<div>Loading...</div>}>
          <Question type="Edit" mongoUserId={mongoUser._id} questionDetails={JSON.stringify(result)} />
        </Suspense>
      </div>
    </>
  )
}

export default page
