/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tailwindcss/classnames-order */
import LeaderboardFilters from "@/components/shared/leaderboard/LeaderboardFilter";
import LeaderboardList from "@/components/shared/leaderboard/LeaderboardList";
import TopThree from "@/components/shared/leaderboard/TopThree";
import UserLeaderboard from "@/components/shared/leaderboard/UserLeaderboard";
import Pagination from "@/components/shared/Pagination";
import {
  getLeetCodeStats,
  getCodeforcesStats,
  getAllUsers,
  getUserById,
} from "@/lib/actions/user.action";
import { getGithubStats } from "@/lib/dashboardData";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React, { Suspense } from "react";

type ErrorObject = {
  error: string;
};

const isError = (data: any): data is ErrorObject => "error" in data;

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const filter = params.filter || "overall";
  const page = Number(params.page) || 1;
  const pageSize = 10;
  const { userId: clerkId } = await auth();
  let mongoUser: { _id: any };
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  const { results: users } = await getAllUsers({
    searchQuery: params.q,
    page: 1,
  });

  // console.log({ users });

  const leaderboardData = await Promise.all(
    users.map(async (user) => {
      const [lcStats, cfStats, gitStats] = await Promise.all([
        user.leetcodeId
          ? getLeetCodeStats(user.leetcodeId)
          : { error: "No LeetCode ID" },
        user.codeforcesId
          ? getCodeforcesStats(user.codeforcesId)
          : { error: "No Codeforces ID" },
        user.githubId
          ? getGithubStats(user.githubId)
          : { error: "No GitHub ID" },
      ]);

      let leetcodeScore = 0;
      let codeforcesScore = 0;
      let gitScore = 0;
      if (!("error" in gitStats)) {
        gitScore =
          (Number(gitStats?.totalCommits) || 0) / 5 +
          (Number(gitStats?.totalPRs) || 0) / 2;
      }

      if (!("error" in lcStats)) {
        leetcodeScore =
          (Number(lcStats?.Easy) || 0) / 2 +
          (Number(lcStats?.Medium) || 0) +
          (Number(lcStats?.Hard) || 0) * 2 +
          (Number(lcStats?.ContestRating) - 1500 || 0);
      }
      // console.log("cfStats Type:", typeof cfStats, cfStats);

      if (!("error" in cfStats)) {
        for (const [rating, count] of Object.entries(cfStats.solvedByRating)) {
          if (Number(rating) <= 1200) {
            codeforcesScore += count / 2;
          } else if (Number(rating) <= 1600) {
            codeforcesScore += count;
          } else if (Number(rating) <= 1900) {
            codeforcesScore += count * 2;
          } else {
            codeforcesScore += count * 3;
          }
        }
        if (cfStats.contestHistory && cfStats.contestHistory.length > 0) {
          const lastContest =
            cfStats.contestHistory[cfStats.contestHistory.length - 1];
          codeforcesScore += Number((lastContest.newRating - 800) / 2);
        }
      }

      const pScore =
        filter === "overall"
          ? Number(leetcodeScore + gitScore + codeforcesScore)
          : filter === "leetcode"
            ? Number(leetcodeScore)
            : filter === "github"
              ? Number(gitScore)
              : Number(codeforcesScore);

      return {
        _id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        username: user.username,
        image: user.picture,
        leetcodeScore,
        codeforcesScore,
        gitScore,
        pScore,
        lcStats,
        cfStats,
        gitStats,
      };
    })
  );

  //     const check= await verifyLeetcodeProfile("naveenchhipa","peer-verify");
  //     console.log("leetcode",check);

  // const token = "xyz"; // the exact text user added in "About Me"
  // console.log("token",token)
  // const verified = await verifyCodeforcesProfile(handle, token);
  // console.log("Codeforces Verified:", verified);

  leaderboardData.sort((a, b) => {
    if (filter === "leetcode") {
      if (b.leetcodeScore != a.leetcodeScore) {
        return b.leetcodeScore - a.leetcodeScore;
      }
      if (b.codeforcesScore != a.codeforcesScore) {
        return b.codeforcesScore - a.codeforcesScore;
      }
      return b.gitScore - a.gitScore;
    }

    if (filter === "codeforces") {
      if (b.codeforcesScore != a.codeforcesScore) {
        return b.codeforcesScore - a.codeforcesScore;
      }
      if (b.leetcodeScore != a.leetcodeScore) {
        return b.leetcodeScore - a.leetcodeScore;
      }
      return b.gitScore - a.gitScore;
    }

    if (filter === "github") {
      if (b.gitScore != a.gitScore) {
        return b.gitScore - a.gitScore;
      }
      if (b.codeforcesScore != a.codeforcesScore) {
        return b.codeforcesScore - a.codeforcesScore;
      }

      return b.leetcodeScore - a.leetcodeScore;
    }

    // Default: "overall"
    const aTotal = a.pScore;
    const bTotal = b.pScore;

    if (bTotal !== aTotal) {
      return bTotal - aTotal; // Sort by total score
    }

    if (b.codeforcesScore !== a.codeforcesScore) {
      return b.codeforcesScore - a.codeforcesScore;
    }

    if (b.leetcodeScore !== a.leetcodeScore) {
      return b.leetcodeScore - a.leetcodeScore;
    }

    return b.gitScore - a.gitScore;
  });
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLeaderboard = leaderboardData.slice(startIndex, endIndex);
  const isNext = leaderboardData.length > endIndex;

  // console.log("filter" ,filter);
  //  console.log(`sorted list ${leaderboardData}`);
  const top3 = leaderboardData.slice(0, 3);
  // const remaining =leaderboardData.slice(3);
  const currentUserIndex = leaderboardData.findIndex(
    (ele) => ele._id.toString() === mongoUser?._id.toString()
  );

  const currentUser = leaderboardData[currentUserIndex];
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
  // console.log("current user", currentUser);
  // top3.map((item) => {
  //   console.log("items ", item);
  // });

  return (
    <div>
      <div className="flex justify-between mt-3">
        <Suspense fallback={<div>Loading Filters...</div>}>
          <LeaderboardFilters />
        </Suspense>
        <Link href="/rating">
          <p className="text-sm font-semibold text-primary-500 cursor-pointer mt-3 ">
            How it works?
          </p>
        </Link>
      </div>

      <TopThree top3={top3} />

      <div className="w-full max-w-4xl mx-auto p-4">
        {/* ----- Current User Card -----  */}
        {currentUser && (
          <Link href={`/dashboard/${currentUser.clerkId}`}>
            <UserLeaderboard
              currentUser={currentUser}
              currentUserRank={currentUserRank}
            />
          </Link>
        )}

        <div className="border border-gray-300 dark:border-dark-400 rounded-[10px]">
          {/* === Table Header === */}
          <div className="bg-pink-100 dark:bg-dark-200 text-white flex justify-between py-2 px-4 font-semibold text-sm mb-1 h-11 rounded-t-[10px]">
            <div className="paragraph-semibold text-dark300_light700 ml-4">
              User Name
            </div>
            <div className="paragraph-semibold text-dark300_light700 mr-10">
              Rank
            </div>
            <div className="paragraph-semibold text-dark300_light700">
              P Score
            </div>
          </div>

          {/* === Leaderboard List === */}

          {paginatedLeaderboard.map((user, index) => (
            <Link href={`/dashboard/${user.clerkId}`} key={index}>
              <LeaderboardList user={user} index={startIndex + index} />
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Suspense fallback={<div>Loading Pagination...</div>}>
            <Pagination pageNumber={page} isNext={isNext} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
