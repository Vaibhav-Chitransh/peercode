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


// export async function getCodeforcesStats(handle: string) {
//   try {
//     // Fetch submissions
//     const resSub = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
//     const dataSub = await resSub.json();
//     if (dataSub.status !== 'OK') throw new Error(dataSub.comment || 'Error fetching submissions');

//     // Fetch rating history
//     const resHist = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
//     const dataHist = await resHist.json();
//     if (dataHist.status !== 'OK') throw new Error(dataHist.comment || 'Error fetching rating history');

//     const submissions: any[] = dataSub.result;
//     const ratingChanges: any[] = dataHist.result;

//     const solvedSet = new Set<string>();
//     const topicCounts: Record<string, number> = {};
//     const solvedByRating: Record<number, number> = {};
//     const heatmap: Record<string, number> = {};
//     let totalSolved = 0;
//     let highestRating = 0;

//     for (const sub of submissions) {
//       if (sub.verdict !== 'OK') continue;

//       const pid = `${sub.problem.contestId}-${sub.problem.index}`;
//       if (solvedSet.has(pid)) continue;
//       solvedSet.add(pid);
//       totalSolved++;

//       // Tags
//       for (const tag of sub.problem.tags as string[]) {
//         topicCounts[tag] = (topicCounts[tag] || 0) + 1;
//       }

//       // Ratings
//       const rating = sub.problem.rating ?? 0;
//       solvedByRating[rating] = (solvedByRating[rating] || 0) + 1;

//       // Heatmap
//       const date = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10);
//       heatmap[date] = (heatmap[date] || 0) + 1;
//     }

//     // Contest History
//     const contestHistory = ratingChanges.map((c) => {
//       if (c.newRating > highestRating) highestRating = c.newRating;
//       return {
//         contestId: c.contestId,
//         contestName: c.contestName,
//         date: new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
//         oldRating: c.oldRating,
//         newRating: c.newRating,
//         delta: c.newRating - c.oldRating,
//         rank: c.rank,
//       };
//     });

//     return {
//       handle,
//       totalSolved,
//       topics: topicCounts,
//       solvedByRating,
//       heatmap,             
//       highestRating,        
//       contestCount: contestHistory.length,
//       contestHistory,        
//     };
//   } catch (err) {
//     console.error(err);
//     return { handle, error: (err as Error).message };
//   }
// }


// export async function getLeetCodeStats(username: string) {
//   try {
//     const response = await fetch("https://leetcode.com/graphql", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Referer": `https://leetcode.com/${username}/`,
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
//       },
//       body: JSON.stringify({
//         query: `
//           query userStats($username: String!) {
//             matchedUser(username: $username) {
//               submitStats {
//                 acSubmissionNum {
//                   difficulty
//                   count
//                 }
//               }
//             }
//             userContestRanking(username: $username) {
//               attendedContestsCount
//               rating
//               globalRanking
//               totalParticipants
//               topPercentage
//             }
//             userContestRankingHistory(username: $username) {
//               contest {
//                 title
//                 startTime
//               }
//               rating
//               attended
//               ranking
//             }
//           }
//         `,
//         variables: { username },
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch stats for ${username}`);
//     }

//     const json = await response.json();
//     const mu = json.data.matchedUser;
//     const cr = json.data.userContestRanking;
//     const history = json.data.userContestRankingHistory;

//     if (!mu) throw new Error(`User ${username} not found`);

//     const stats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
//     for (const { difficulty, count } of mu.submitStats.acSubmissionNum) {
//       stats[difficulty as keyof typeof stats] = count;
//       if (difficulty === "All") stats.Total = count;
//     }

//     const ratingHistory = (history || [])
//       .filter((c: any) => c.attended)
//       .map((c: any) => ({
//         title: c.contest.title,
//         date: new Date(c.contest.startTime * 1000).toLocaleDateString(),
//         rating: Math.round(c.rating),
//         rank: c.ranking ?? "N/A",
//       }));

//     return {
//       username,
//       ...stats,
//       ContestRating: cr?.rating ? Math.round(cr.rating) : null,
//       GlobalRank: cr?.globalRanking ?? null,
//       TopPercent: cr?.topPercentage ?? null,
//       Contests: cr?.attendedContestsCount ?? 0,
//       ContestHistory: ratingHistory,
//     };
//   } catch (err) {
//     console.error(err);
//     return { username, error: (err as Error).message };
//   }
// }


// export async function getCodechefStats(username: string) {
//   try {
//     const res = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
//     if (!res.ok) throw new Error("Failed to fetch CodeChef stats");

//     const data = await res.json();

//     // Sample fields: data.rating, data.stars, data.globalRank, data.problemsFullySolved, data.contestRankings

//     return {
//       username,
//       currentRating: data.currentRating,
//       highestRating: data.highestRating,
//       stars: data.stars,
//       globalRank: data.globalRank,
//       countryRank: data.countryRank,
//       heatmap: data.heatmap,
//       ratingData: data.ratingData, // if available
//     };
//   } catch (err) {
//     console.error(err);
//     return { username, error: (err as Error).message };
//   }
// }


// export async function getCodechefStatsWithDetails(username: string) {
//   try {
//     const res = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
//     if (!res.ok) throw new Error("Failed to fetch base CodeChef stats");
//     const base = await res.json();

//     const profileRes = await fetch(`https://www.codechef.com/users/${username}`);
//     const html = await profileRes.text();

//     // 1. Fallback values
//     let fullySolved = base.problemsFullySolved || 0;
//     let partiallySolved = 0;
//     let totalContests = 0;
//     const topicCounts: Record<string, number> = {};
//     const ratingSeg: Record<string, number> = {};

//     // 2. Try parsing Fully/Partially Solved
//     const matchFull = html.match(/Fully Solved<\/h5>\s*<h5[^>]*>(\d+)<\/h5>/);
//     if (matchFull) fullySolved = Number(matchFull[1]);

//     const matchPartial = html.match(/Partially Solved<\/h5>\s*<h5[^>]*>(\d+)<\/h5>/);
//     if (matchPartial) partiallySolved = Number(matchPartial[1]);

//     // 3. Topic tags & count
//     const topicRegex = /<a href="\/tags\/[^"]+"[^>]*>([^<]+)<\/a>/g;
//     let match;
//     while ((match = topicRegex.exec(html))) {
//       const tag = match[1];
//       topicCounts[tag] = (topicCounts[tag] || 0) + 1;
//     }

//     // 4. Rating-wise problems (optional)
//     const ratingRegex = /<td>(\d{3,4})<\/td>\s*<td>(\d+)<\/td>/g;
//     while ((match = ratingRegex.exec(html))) {
//       const rating = match[1];
//       const count = parseInt(match[2], 10);
//       ratingSeg[rating] = count;
//     }

//     // 5. Contests participated (from header card)
//     const contestsMatch = html.match(/Contest History<\/strong><\/div>\s*<div[^>]*>(\d+)<\/div>/);
//     if (contestsMatch) totalContests = Number(contestsMatch[1]);

//     return {
//       username,
//       currentRating: base.currentRating,
//       highestRating: base.highestRating,
//       stars: base.stars,
//       globalRank: base.globalRank,
//       countryRank: base.countryRank,
//       heatmap: base.heatmap, // preserved
//       ratingData: base.ratingData, // preserved

//       fullySolved,
//       partiallySolved,
//       totalSolved: fullySolved + partiallySolved,
//       topicCounts,
//       ratingSeg,
//       totalContests,
//     };
//   } catch (err) {
//     console.error(err);
//     return { username, error: (err as Error).message };
//   }
// }