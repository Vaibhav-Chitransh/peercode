/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getQuestionById } from "@/lib/actions/question.action";
import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Metric from "@/components/shared/Metric";
import ClockIcon from "@/assets/icons/clock-2.svg";
import MessageIcon from "@/assets/icons/message.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Answer from "@/components/forms/Answer";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswer from "@/components/shared/AllAnswer";
import Votes from "@/components/shared/Votes";
import { URLProps } from "@/types";

const page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = await auth();
  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }
  const result = await getQuestionById({ questionId: params.id });

  if (!result || !result.author) {
    return <div>Question not found.</div>;
  }
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Suspense fallback={<div>Loading Votes...</div>}>
              <Votes
                type="Question"
                itemId={JSON.stringify(result._id)}
                userId={JSON.stringify(mongoUser?._id)}
                upvotes={result.upvotes.length}
                hasupVoted={result.upvotes.includes(mongoUser?._id)}
                downvotes={result.downvotes.length}
                hasdownVoted={result.downvotes.includes(mongoUser?._id)}
                hasSaved={mongoUser?.saved.includes(result._id)}
              />
            </Suspense>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl={ClockIcon}
          alt="clock icon "
          value={` asked ${getTimeStamp(result.createdAt)}`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl={MessageIcon}
          alt="message"
          value={formatNumber(result.answer?.length || 0)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl={EyeIcon}
          alt="eye"
          value={formatNumber(result.views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => {
          return (
            <RenderTag
              key={tag._id}
              id={tag._id}
              name={tag.name}
              showCount={false}
            />
          );
        })}
      </div>

      <AllAnswer
        questionId={result._id}
        userId={mongoUser?._id}
        totalAnswers={result.answer ? result.answer.length : 0}
        page={searchParams?.page ? +searchParams.page : undefined}
        filter={searchParams?.filter}
      />

      <Suspense fallback={<div>Loading Answer Form...</div>}>
        <Answer
          question={result.content}
          questionId={JSON.stringify(result._id)}
          authorId={JSON.stringify(mongoUser?._id)}
        />
      </Suspense>
    </>
  );
};

export default page;
