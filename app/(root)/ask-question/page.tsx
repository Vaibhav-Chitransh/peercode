import AskQuestionClient from "./AskQuestionClient";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  const { userId } = await auth();
  // const userId = "clerk_abc123";

  if (!userId) {
    console.log("User not authenticated");
    redirect("/sign-in");
  }

  const mongoUser = await getUserById({ userId });
  if (!mongoUser) {
    console.log("User not found in database");
    redirect("/sign-up"); // or show an error page if you prefer
  }

  return <AskQuestionClient mongoUserId={JSON.stringify(mongoUser._id)} />;
};

export default AskQuestion;
