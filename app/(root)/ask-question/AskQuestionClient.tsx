"use client";
import Question from "@/components/forms/Question";
import React, { Suspense } from "react";

interface AskQuestionClientProps {
  mongoUserId: string;
}

const AskQuestionClient: React.FC<AskQuestionClientProps> = ({
  mongoUserId,
}) => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Suspense>
          <Question mongoUserId={mongoUserId} />
        </Suspense>
      </div>
    </div>
  );
};

export default AskQuestionClient;
