import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Link from "next/link";
import React, { Suspense } from "react";
import SearchIcon from "../../../assets/icons/search.svg";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import Pagination from "@/components/shared/Pagination";
import { auth } from "@clerk/nextjs/server";

const Home = async (
  props:
    | { searchParams: { [key: string]: string | string[] | undefined } }
    | {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
      }
) => {
  const searchParams = await Promise.resolve(props.searchParams);

  const filter = Array.isArray(searchParams.filter)
    ? searchParams.filter[0]
    : searchParams.filter;
  const q = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  const pageRaw = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const page = pageRaw ? +pageRaw : 1;

  const { userId } = await auth();

  let result;
  if (filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: q,
        page,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: q,
      filter,
      page,
    });
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <button className="primary-gradient min-h-[46px] rounded-[8px] px-4 py-3 !text-light-900">
            Ask a Question
          </button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={null}>
          <LocalSearchbar
            route="/"
            iconPosition="left"
            imgSrc={SearchIcon}
            placeholder="Search for questions"
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={null}>
          <Filter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <HomeFilters />
      </Suspense>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
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
            title="There's no question to show"
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
          <Pagination pageNumber={page} isNext={result.isNext} />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
