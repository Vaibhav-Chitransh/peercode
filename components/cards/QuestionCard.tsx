/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tailwindcss/classnames-order */
import Link from "next/link";
import React from "react";
import Metric from "../shared/Metric";
import LikeIcon from "@/assets/icons/like.svg";
import MessageIcon from "../../assets/icons/message.svg";
import EyeIcon from "../../assets/icons/eye.svg";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionProps {
  clerkId?: string;
  _id: string;
  title: string;
  tags?: { _id: string; name: string }[];
  author?: { _id: string; name: string; picture: string; clerkId?: string };
  upvotes?: string[];
  views?: number;
  answers?: unknown[];
  createdAt?: Date;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags = [],
  author,
  upvotes = [],
  views = 0,
  answers = [],
  createdAt,
}: QuestionProps) => {
  // Early return if essential data is missing
  if (!_id || !title) return null;
  const showActionButtons =
    clerkId && author && clerkId === (author as { clerkId?: string }).clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {createdAt && getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {/* map on render tag component with key id and name */}
        {tags &&
          tags.length > 0 &&
          tags.map((tag) => (
            <span
              key={tag._id}
              className="rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag.name}
            </span>
          ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author?.picture || ""}
          alt="user"
          value={author?.name || "Anonymous"}
          title={` - asked ${createdAt ? getTimeStamp(createdAt) : "Unknown time"}`}
          href={`/profile/${author?._id || ""}`}
          isAuthor
          textStyles="small-medium text-dark400_light800"
        />
        <div className="flex items-center gap-5 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl={LikeIcon}
            alt="Upvotes"
            value={formatNumber(upvotes.length)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl={MessageIcon}
            alt="message"
            value={Array.isArray(answers) ? answers.length : 0}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl={EyeIcon}
            alt="eye"
            value={formatNumber(views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
