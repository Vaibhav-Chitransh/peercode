/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  GetUserStatsParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import { error } from "console";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user and everything related to it like questions, answers, comments, etc.

    // const userQuestionIds = await Question.find({author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // delete user answers

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 9 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    // const {page = 1, pageSize = 20, filter, searchQuery} = params;

    const results = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + results.length;

    return { results, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not Found");
    }

    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      //means question is already saved of remove this

      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      //add question to save list
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: "Tag", select: "_id name" },
        { path: "author", model: "User", select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;
    const totalSavedCount = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {}, // no pagination
      select: "_id", // only get IDs for performance
    });

    const total = totalSavedCount.saved.length;
    const isNext = total > skipAmount + savedQuestions.length;

    return { result: savedQuestions, isNext };
  } catch (error) {
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Question.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [answerUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id name picture clerkId");

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");
    
    const isNext=totalAnswers > skipAmount +userAnswers.length;

    return { totalAnswers, answers: userAnswers ,isNext};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getLeetCodeStats(username: string) {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": `https://leetcode.com/${username}/`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: `
          query userStats($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              totalParticipants
              topPercentage
            }
            userContestRankingHistory(username: $username) {
              contest {
                title
                startTime
              }
              rating
              attended
              ranking
            }
          }
        `,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stats for ${username}`);
    }

    const json = await response.json();
    const mu = json.data.matchedUser;
    const cr = json.data.userContestRanking;
    const history = json.data.userContestRankingHistory;

    if (!mu) throw new Error(`User ${username} not found`);

    const stats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
    for (const { difficulty, count } of mu.submitStats.acSubmissionNum) {
      stats[difficulty as keyof typeof stats] = count;
      if (difficulty === "All") stats.Total = count;
    }

    const ratingHistory = (history || [])
      .filter((c: any) => c.attended)
      .map((c: any) => ({
        title: c.contest.title,
        date: new Date(c.contest.startTime * 1000).toLocaleDateString(),
        rating: Math.round(c.rating),
        rank: c.ranking ?? "N/A",
      }));

    return {
      username,
      ...stats,
      ContestRating: cr?.rating ? Math.round(cr.rating) : null,
      GlobalRank: cr?.globalRanking ?? null,
      TopPercent: cr?.topPercentage ?? null,
      Contests: cr?.attendedContestsCount ?? 0,
      ContestHistory: ratingHistory,
    };
  } catch (err) {
    console.error(err);
    return { username, error: (err as Error).message };
  }
}

export async function getCodeforcesStats(handle: string) {
  try {
    // Fetch all submissions
    const resSub = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
    const dataSub = await resSub.json();
    if (dataSub.status !== 'OK') throw new Error(dataSub.comment || 'Error fetching submissions');

    // Fetch rating history
    const resHist = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const dataHist = await resHist.json();
    if (dataHist.status !== 'OK') throw new Error(dataHist.comment || 'Error fetching rating history');

    const submissions: any[] = dataSub.result;
    const ratingChanges: any[] = dataHist.result; // rating history objects :contentReference[oaicite:1]{index=1}

    // Aggregate stats
    const solvedSet = new Set<string>();
    const topicCounts: Record<string, number> = {};
    const solvedByRating: Record<number, number> = {};
    let totalSolved = 0;

    for (const sub of submissions) {
      if (sub.verdict !== 'OK') continue;
      const pid = `${sub.problem.contestId}-${sub.problem.index}`;
      if (solvedSet.has(pid)) continue;
      solvedSet.add(pid);
      totalSolved++;

      // Tags
      for (const tag of sub.problem.tags as string[]) {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      }

      // Problem rating
      const rating = sub.problem.rating ?? 0;
      solvedByRating[rating] = (solvedByRating[rating] || 0) + 1;
    }

    // Format contest history
    const contestHistory = ratingChanges.map(c => ({
      contestId: c.contestId,
      contestName: c.contestName,
      date: new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
      oldRating: c.oldRating,
      newRating: c.newRating,
      delta: c.newRating - c.oldRating,
    }));

    // Assemble final stats
    return {
      handle,
      totalSolved,
      topics: topicCounts,
      solvedByRating,
      contestCount: contestHistory.length,
      contestHistory,
    };
  } catch (err) {
    console.error(err);
    return { handle, error: (err as Error).message };
  }
}

export async function getCodechefStats(username: string) {
  try {
    const res = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    if (!res.ok) throw new Error("Failed to fetch CodeChef stats");

    const data = await res.json();

    // Sample fields: data.rating, data.stars, data.globalRank, data.problemsFullySolved, data.contestRankings

    return {
      username,
      currentRating: data.currentRating,
      highestRating: data.highestRating,
      stars: data.stars,
      globalRank: data.globalRank,
      countryRank: data.countryRank,
      problemsSolved: data.problemsFullySolved,
      contestsParticipated: data.contestCount,
      contestHistory: data.contestHistory, // if available
    };
  } catch (err) {
    console.error(err);
    return { username, error: (err as Error).message };
  }
}

export async function getCodechefTotalSolved(username: string): Promise<number | null> {
  try {
    const res = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    if (!res.ok) throw new Error("Failed to fetch CodeChef stats");

    const data = await res.json();

    const fullySolvedCount =
      data.problemsFullySolved?.["Fully Solved"]?.count ?? null;

    return fullySolvedCount;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function verifyLeetcodeProfile(userId: string, token: string): Promise<boolean> {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            profile {
              realName
              aboutMe
            }
          }
        }
      `,
      variables: { username: userId },
    }),
  });

  const data = await response.json();
  const profile = data?.data?.matchedUser?.profile;

  return (
    profile?.realName === token || profile?.aboutMe === token
  );
}

export async function verifyCodeforcesProfile(
  handle: string,
  token: string
): Promise<boolean> {
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );
  const json = await res.json();
  if (json.status !== "OK" || !json.result?.length) return false;

  const user = json.result[0];
  const first = user.firstName?.trim() || "";
  const last = user.lastName?.trim() || "";

  console.log(`first ${first} second ${last}`)

  return first === token || last === token;
}


export async function verifyCodechefProfile(
  handle: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`https://www.codechef.com/users/${handle}`, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
    });

    if (!res.ok) return false;

    const html = await res.text();
    
    // Split HTML and look for name-related sections
    const lines = html.split('\n');
    let extractedName = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Look for lines that might contain the name
      if (lowerLine.includes('name') || lowerLine.includes('profile')) {
        // Check current line and next few lines for name content
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          const checkLine = lines[j];
          
          // Look for content within tags that could be the name
          const contentMatches = [
            checkLine.match(/<h[1-6][^>]*>([^<]+)</i),
            checkLine.match(/<span[^>]*>([^<]+)</i),
            checkLine.match(/<div[^>]*>([^<]+)</i),
            checkLine.match(/>([A-Za-z\s]{3,50})</), // Look for name-like text
          ];

          for (const match of contentMatches) {
            if (match && match[1]) {
              const potentialName = match[1].trim();
              // Filter out obvious non-names (handles, numbers, short text)
              if (potentialName.length > 2 && 
                  potentialName.length < 50 && 
                  /^[A-Za-z\s]+$/.test(potentialName) &&
                  !potentialName.toLowerCase().includes('codechef') &&
                  !potentialName.toLowerCase().includes('profile')) {
                extractedName = potentialName;
                break;
              }
            }
          }
          
          if (extractedName) break;
        }
        
        if (extractedName) break;
      }
    }

    console.log("Alternative extraction - Name:", extractedName);
    
    // Clean and compare
    extractedName = extractedName
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ')
      .trim();

      console.log("extracted name" ,extractedName)

    return extractedName=== token;

  } catch (error) {
    console.error("Error in alternative name verification:", error);
    return false;
  }
}

