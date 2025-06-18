import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: AnswerTabProps) => {
  const result = await getUserAnswers({ userId,   page: searchParams.page ? +searchParams.page : 1, });
  const uniqueQuestionMap = new Map();
  const uniqueAnswers = result.answers.filter((answer) => {
    const questionId = answer.question._id.toString();
    if (uniqueQuestionMap.has(questionId)) return false;
    uniqueQuestionMap.set(questionId, true);
    return true;
  });
  return (
    <>
      {uniqueAnswers.map((item) => (
        <AnswerCard
          key={item._id}
          clerkId={clerkId}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}
      <div className="mt-10">
         <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
      </div>
    </>
  );
};

export default AnswerTab;
