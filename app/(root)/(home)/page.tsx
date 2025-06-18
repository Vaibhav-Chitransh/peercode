/* eslint-disable tailwindcss/classnames-order */
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import SearchIcon from '@/assets/icons/search.svg';

import type { Metadata } from 'next';
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'PeerCode',
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = await auth();

  const sp = await searchParams;

  let result;

  if(sp?.filter === 'recommended') {
    if(userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: sp.q,
        page: sp.page ? +sp.page : 1,
      }); 
    } else {
      result = {
        questions: [],
        isNext: false,
      }
    }
  } else {
    result = await getQuestions({
      searchQuery: sp.q,
      filter: sp.filter,
      page: sp.page ? +sp.page : 1,
    }); 
  }
  

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1> 

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 rounded-[8px]">
            Ask a Question
          </Button>
        </Link> 
      </div> 

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<div>Loading Searchbar...</div>}>
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
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading Home Filters...</div>}>
        <HomeFilters />
      </Suspense>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ?
          result.questions.map((question) => (
            <QuestionCard 
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
          : <NoResult 
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />}
      </div>
      <div className="mt-10">
        <Suspense fallback={<div>Loading Pagination...</div>}>
          <Pagination 
          pageNumber={sp?.page ? +sp.page : 1}
          isNext={result.isNext}
        />
        </Suspense>
      </div>
    </>
  )
}