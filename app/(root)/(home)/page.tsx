import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Link from "next/link";
import React from "react";
import SearchIcon from "../../../assets/icons/search.svg";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";

// const questions = [
//   {
//     _id: 1,
//     title: "Cascading Deletes in SQLAlchemy?",
//     tags: [
//       { _id: "1", name: "python" },
//       { _id: "2", name: "sql" },
//     ],
//     author: {
//       _id: "a1",
//       name: "Vaibhav Chitransh",
//       picture: "https://example.com/vaibhav.jpg",
//     },
//     upvotes: 43791,
//     views: 10000,
//     answers: [],
//     createdAt: new Date("2024-10-01T12:00:00Z"),
//   },
//   {
//     _id: 2,
//     title: "How to center a div?",
//     tags: [
//       { _id: "3", name: "css" },
//       { _id: "4", name: "html" },
//     ],
//     author: {
//       _id: "a2",
//       name: "Naveen Chhipa",
//       picture: "https://example.com/john.jpg",
//     },
//     upvotes: 15,
//     views: 780,
//     answers: [],
//     createdAt: new Date("2025-04-01T12:00:00Z"),
//   },
//   {
//     _id: 3,
//     title: "How to center a div?",
//     tags: [
//       { _id: "3", name: "css" },
//       { _id: "4", name: "html" },
//     ],
//     author: {
//       _id: "a2",
//       name: "Naveen Chhipa",
//       picture: "https://example.com/john.jpg",
//     },
//     upvotes: 15,
//     views: 780,
//     answers: [],
//     createdAt: new Date("2025-04-01T12:00:00Z"),
//   },
//   {
//     _id: 4,
//     title: "How to center a div?",
//     tags: [
//       { _id: "3", name: "css" },
//       { _id: "4", name: "html" },
//     ],
//     author: {
//       _id: "a2",
//       name: "Naveen Chhipa",
//       picture: "https://example.com/john.jpg",
//     },
//     upvotes: 15,
//     views: 780,
//     answers: [],
//     createdAt: new Date("2025-04-01T12:00:00Z"),
//   },
//   {
//     _id: 5,
//     title: "How to center a div?",
//     tags: [
//       { _id: "3", name: "css" },
//       { _id: "4", name: "html" },
//     ],
//     author: {
//       _id: "a2",
//       name: "Naveen Chhipa",
//       picture: "https://example.com/john.jpg",
//     },
//     upvotes: 15,
//     views: 780,
//     answers: [],
//     createdAt: new Date("2025-04-01T12:00:00Z"),
//   },
//   {
//     _id: 6,
//     title: "How to center a div?",
//     tags: [
//       { _id: "3", name: "css" },
//       { _id: "4", name: "html" },
//     ],
//     author: {
//       _id: "a2",
//       name: "Naveen Chhipa",
//       picture: "https://example.com/john.jpg",
//     },
//     upvotes: 15,
//     views: 780,
//     answers: [],
//     createdAt: new Date("2025-04-01T12:00:00Z"),
//   },
// ];

const Home = async () => {
  const result = await getQuestions();
  // console.log(result.questions);

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
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc={SearchIcon}
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

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
    </>
  );
};

export default Home;
