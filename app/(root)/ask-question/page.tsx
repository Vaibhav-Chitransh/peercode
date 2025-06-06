import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
// import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  // const { userId } = await auth();
  const userId = "clerk_abc123";

  // if (!userId) {
  //   console.log("User not authenticated");
  //   redirect("/sign-in");
  // }

  const mongoUser = await getUserById({ userId });
  console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
