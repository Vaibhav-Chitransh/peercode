"use server";

import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({ content, author, question });
    // await newAnswer.save();
    // console.log("new Answer", newAnswer);

    // Add the answer to the question-answer array

    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    await Interaction.create({user: author, action: 'answer', question, answer: newAnswer._id, tags: questionObject.tags});

    await User.findByIdAndUpdate(author, {$inc: {reputation: 10}});

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswer(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId ,sortBy ,page = 1,pageSize =10 } = params;
    const skipAmount = (page - 1) * pageSize;
      let sortOptions={}
      
     switch (sortBy){

      case "hightestUpvotes":
        sortOptions={upvotes: -1}
        break;
      case "lowestUpvotes":
        sortOptions={upvotes: 1}
        break;
      case "recent":
        sortOptions={createdAt: -1}
        break;
      case "old":
        sortOptions={createdAt: 1}
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        select: "_id clerkId name picture",
      })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalAnswer = await Answer.countDocuments({question: questionId})
    const isNext=totalAnswer  > skipAmount + answers.length;
    return { answers ,isNext };
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
    await User.findByIdAndUpdate(userId, {$inc: {reputation: hasupVoted ? -2 : 2}});

    await User.findByIdAndUpdate(answer.author, {$inc: {reputation: hasupVoted ? -10 : 10}});
    
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
    await User.findByIdAndUpdate(userId, {$inc: {reputation: hasdownVoted ? -2 : 2}});

    await User.findByIdAndUpdate(answer.author, {$inc: {reputation: hasdownVoted ? -10 : 10}});
   
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    const {answerId} = params;

    const answer = await Answer.findById(answerId);

    if(!answer) throw new Error("Answer not Found");

    await Answer.deleteOne({_id: answerId});
    await Question.updateMany({_id: answer.question}, {$pull: {answers: answerId}});
    await Interaction.deleteMany({answer: answerId});

  } catch (error) {
    console.log(error);
  }
}