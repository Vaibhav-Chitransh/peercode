/* eslint-disable @typescript-eslint/no-explicit-any */
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
// import { IQuestion } from '@/database/question.model'
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import React, { Suspense } from "react";
import NoResult from "@/components/shared/NoResult";
import SearchIcon from "@/assets/icons/search.svg";
import Pagination from "@/components/shared/Pagination";
const page = async ({ params, searchParams }: URLProps) => {
  const sp = await searchParams;
  const result = await getQuestionByTagId({
    tagId: params.id,
    searchQuery: sp.q,
    page: sp.page ? +sp.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <Suspense>
          <LocalSearchbar
            route={`/tags/${params.id}`}
            iconPosition="left"
            imgSrc={SearchIcon}
            placeholder="Search tag questions"
            otherClasses="flex-1"
          />
        </Suspense>
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={String(question._id)}
              _id={String(question._id)}
              title={question.title}
              author={question.author}
              tags={question.tags}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no tag question saved to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discusion. Our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Suspense fallback={null}>
          <Pagination
            pageNumber={sp?.page ? +sp.page : 1}
            isNext={result.isNext}
          />
        </Suspense>
      </div>
    </>
  );
};

export default page;
