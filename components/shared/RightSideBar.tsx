import React from "react";
import Link from "next/link";
import Image from "next/image";
import ChevronrRightIcon from "@/assets/icons/chevron-right.svg";
import RenderTag from "./RenderTag";
const hotQuestions = [
  {
    id: 1,
    title:
      "Given a string, find the first character that does not repeat throughout the entire string.",
  },
  {
    id: 2,
    title:
      "Write a function to reverse a singly linked list using both iterative and recursive approaches.",
  },
  {
    id: 3,
    title:
      "How would you detect a cycle in a directed graph using Depth-First Search (DFS) algorithm?",
  },

  {
    id: 4,
    title:
      "Merge two sorted arrays in-place without using extra space and maintain the sorted order.",
  },
  {
    id: 5,
    title:
      "Find and return the longest palindromic substring present in the given input string.",
  },
];

const popularTags = [
  {
    id: 1,
    name: "javascript",
    totalQuestions: 15,
  },
  {
    id: 2,
    name: "next",
    totalQuestions: 10,
  },
  {
    id: 3,
    name: "react",
    totalQuestions: 8,
  },
  {
    id: 4,
    name: "typescript",
    totalQuestions: 3,
  },
  {
    id: 5,
    name: "redux",
    totalQuestions: 7,
  }
];

const RightSideBar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 right-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
      {/*
        This div is for TOP QUESTIONS
      */}
      <div>
        <h3 className="h3-bold text-dark200_light900"> Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/questions/${question.id}`}
              key={question.id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="text-dark500_light700 text-[11px] ">
                {question.title}
              </p>

              <Image
                src={ChevronrRightIcon}
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900"> Popular Tags</h3>

        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag.id}
              id={tag.id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
