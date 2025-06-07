/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types"
import AnswerCard from "../cards/AnswerCard";

interface AnswerTabProps extends SearchParamsProps {
    userId: string;
    clerkId?: string | null;
}

const AnswerTab = async ({searchParams, userId, clerkId}: AnswerTabProps) => {
    const result = await getUserAnswers({userId, page: 1});

  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard key={item._id} clerkId={clerkId} _id={item._id} question={item.question} author={item.author} upvotes={item.upvotes.length} createdAt={item.createdAt} />
      ))}
    </>
  )
}

export default AnswerTab
