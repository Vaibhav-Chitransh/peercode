import AskQuestionClient from "./AskQuestionClient";
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

  return <AskQuestionClient mongoUserId={JSON.stringify(mongoUser._id)} />;
};

export default AskQuestion;
