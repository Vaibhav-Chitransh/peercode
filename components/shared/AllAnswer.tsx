import React, { Suspense } from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswer } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}
const AllAnswer = async ({ questionId, userId ,page,filter }: Props) => {
  const result = await getAnswer({
    questionId,
     page: page ? +page: 1,
    sortBy: filter,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {result.answers.length} Answers
        </h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1 ">
                      <span className="max-sm:hidden"> - </span> answerd{" "}
                      {getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Suspense fallback={<div>Loading Votes...</div>}>
                    <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    hasupVoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    hasdownVoted={answer.downvotes.includes(userId)}
                  />
                  </Suspense>
                </div>
              </div>
           
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-10">
         <Pagination
        pageNumber={page ? +page: 1}
        isNext={result.isNext}
      />
      </div>

    </div>
  );
};

export default AllAnswer;
