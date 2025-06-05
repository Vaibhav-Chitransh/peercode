import React from "react";
import Link from "next/link";
import Image from "next/image";
import ChevronrRightIcon from "@/assets/icons/chevron-right.svg";
import RenderTag from "./RenderTag";
const hotQuestions = [
  {
    _id: 1,
    title:
      "Given a string, find the first character that does not repeat throughout the entire string.",
  },
  {
    _id: 2,
    title:
      "Write a function to reverse a singly linked list using both iterative and recursive approaches.",
  },
  {
    _id: 3,
    title:
      "How would you detect a cycle in a directed graph using Depth-First Search (DFS) algorithm?",
  },

  {
    _id: 4,
    title:
      "Merge two sorted arrays in-place without using extra space and maintain the sorted order.",
  },
  {
    _id: 5,
    title:
      "Find and return the longest palindromic substring present in the given input string.",
  },
];

const popularTags = [
  {
    _id: 1,
    name: "javascript",
    totalQuestions: 15,
  },
  {
    _id: 2,
    name: "next",
    totalQuestions: 10,
  },
  {
    _id: 3,
    name: "react",
    totalQuestions: 8,
  },
  {
    _id: 4,
    name: "typescript",
    totalQuestions: 3,
  },
  {
    _id: 5,
    name: "redux",
    totalQuestions: 7,
  },
  {
    _id: 6,
    name: "nodejs",
    totalQuestions: 7,
  },
  {
    _id: 7,
    name: "expressjs",
    totalQuestions: 7,
  },
];

const RightSideBar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 box-border flex h-screen min-w-0 max-w-[100vw] flex-col overflow-x-hidden border-l p-6 pt-8 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[400px]">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/*
          This div is for TOP QUESTIONS
        */}
        <div>
          <h3 className="h3-bold text-dark200_light900"> Top Questions</h3>
          <div className="mt-5 flex w-10/12 flex-col gap-4 overflow-x-hidden">
            {hotQuestions.map((question) => (
              <Link
                href={`/questions/${question._id}`}
                key={question._id}
                className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-7 overflow-x-hidden"
              >
                <p className="text-dark500_light700 w-full text-[13px] leading-snug transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-300">
                  {question.title}
                </p>

                <Image
                  src={ChevronrRightIcon}
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <h3 className="h3-bold text-dark200_light900"> Popular Tags</h3>
          <div className="mt-7 flex w-10/12 flex-col gap-4 overflow-x-hidden">
            {popularTags.map((tag) => (
              <RenderTag
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                totalQuestions={tag.totalQuestions}
                showCount
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
