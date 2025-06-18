/* eslint-disable @typescript-eslint/no-explicit-any */
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import React, { Suspense } from "react";
import SearchIcon from "../../../assets/icons/search.svg";
import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = await auth();
  if (!userId) return null;

  const params = await searchParams;
  const { result, isNext } = await getSavedQuestions({
    clerkId: userId,
    searchQuery: params.q,
    filter: params.filter,
    page: params.page ? +params.page : 1,
  });
  // console.log(result);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<div>Loading Search Bar...</div>}>
          <LocalSearchbar
            route="/"
            iconPosition="left"
            imgSrc={SearchIcon}
            placeholder="Search for questions"
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={<div>Loading Filters...</div>}>
          <Filter
            filters={QuestionFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </Suspense>
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.length > 0 ? (
          result.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
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
            title="There's no question saved to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discusion. Our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Suspense fallback={<div>Loading Pagination...</div>}>
          <Pagination
            pageNumber={params?.page ? + params.page : 1}
            isNext={isNext}
          />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
