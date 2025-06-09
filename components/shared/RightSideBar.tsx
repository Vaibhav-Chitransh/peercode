import React from "react";
import Link from "next/link";
import Image from "next/image";
import ChevronrRightIcon from "@/assets/icons/chevron-right.svg";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.action";


const RightSideBar = async () => {
  const hotQuestions = await getHotQuestions();
  const popularTags =await getTopPopularTags();
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 box-border flex h-screen min-w-0 max-w-[100vw] flex-col overflow-x-hidden border-l p-6 pt-8 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[400px]">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Top Questions */}
        <div>
          <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
          <div className="mt-5 flex w-10/12 flex-col gap-4 overflow-x-hidden">
            {hotQuestions.map((question) => (
              <Link
                href={`/question/${question._id}`}
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

        {/* Popular Tags */}
        <div className="mt-7">
          <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
          <div className="mt-7 flex w-10/12 flex-col gap-4 overflow-x-hidden">
            {popularTags.map((tag) => (
              <RenderTag
                key={tag.id}
                id={tag.id}
                name={tag.name}
                totalQuestions={tag.numberofQuestions}
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