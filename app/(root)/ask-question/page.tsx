import AskQuestionClient from "./AskQuestionClient";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const AskQuestion = async () => {
  const { userId } = await auth();

  if (!userId) {
    // console.log("User not authenticated");
    redirect("/sign-in");
  }

  const mongoUser = await getUserById({ userId });
  if (!mongoUser) {
    // console.log("User not found in database");
    redirect("/sign-up"); 
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AskQuestionClient mongoUserId={JSON.stringify(mongoUser?._id)} />
    </Suspense>
  );
};

export default AskQuestion;
