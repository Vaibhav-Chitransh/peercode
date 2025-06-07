"use server";

import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({ content, author, question });
    // await newAnswer.save();
    console.log("new Answer", newAnswer);

    // Add the answer to the question-answer array

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    //TODO: Add interaction

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswer(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } =
      params;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error("Answer not found");
    }
    // Increment user's reputation 
    
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } =
      params;
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error("Answer not found");
    }
    // Increment user's reputation
   
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}



