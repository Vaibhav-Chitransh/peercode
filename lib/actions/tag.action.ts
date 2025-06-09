/* eslint-disable @typescript-eslint/no-unused-vars */
// "user server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interactions for the user and group by tags...
    // Interaction...

    // Replace with actual logic to get top tags
    return [
      { _id: "1", name: "JavaScript" },
      { _id: "2", name: "React" },
      { _id: "3", name: "Node.js" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const {searchQuery} = params;

    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ]
    }

    const tags = await Tag.find(query);
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId};

    const tag = await Tag.findOne({ tagFilter }).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i'}}
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: "Tag", select: "_id name" },
        { path: "author", model: "User", select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;
    return { tagTitle: tag.name , questions};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags(){
  try {
    connectToDatabase();
    const populatTags =await Tag.aggregate([
      { $project: {name: 1,numberofQuestions: { $size: "$questions"}}},
      { $sort: {numberofQuestions: -1}},
      { $limit: 5}
    ])
    return populatTags;
    
  } catch (error) {
    throw error;
  }
}