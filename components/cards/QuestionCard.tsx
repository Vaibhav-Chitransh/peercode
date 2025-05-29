import Link from "next/link";
import React from "react";
import Metric from "../shared/Metric";

interface QuestionProps {
  _id: number;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string };
  upvotes: number;
  views: number;
  answers: number;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {String(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signed in add edit or delete options */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {/* map on render tag component with key id and name */}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric  />
      </div>
    </div>
  );
};

export default QuestionCard;
