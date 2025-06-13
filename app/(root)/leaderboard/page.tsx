/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tailwindcss/classnames-order */
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import {
  getLeetCodeStats,
  getCodeforcesStats,
  getCodechefStats,
  getAllUsers,
  getUserById,
} from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { useSearchParams } from "next/navigation";
import React from "react";

type ErrorObject = {
  error: string;
};

const isError = (data: any): data is ErrorObject => "error" in data;

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const filter = searchParams.filter || "overall";
  const { userId: clerkId } = await auth();
  let mongoUser: { _id: any };
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  const { results: users } = await getAllUsers({
    searchQuery: searchParams.q,
    page: Number(searchParams.page) || 1,
  });

  // console.log({ users });

  const leaderboardData = await Promise.all(
    users.map(async (user) => {
      const [lcStats, cfStats, ccStats] = await Promise.all([
        user.leetcodeId
          ? getLeetCodeStats(user.leetcodeId)
          : { error: "No LeetCode ID" },
        user.codeforcesId
          ? getCodeforcesStats(user.codeforcesId)
          : { error: "No Codeforces ID" },
        user.codechefId
          ? getCodechefStats(user.codechefId)
          : { error: "No CodeChef ID" },
      ]);

      let leetcodeScore = 0;
      let codeforcesScore = 0;
      let codechefScore = 0;

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
      // console.log({ codeforcesScore });

      if (!("error" in ccStats)) {
        // console.log("ccStats Type:", typeof ccStats, ccStats);
        codechefScore += Number((ccStats.currentRating - 800) / 2);
      }
      // console.log({ codechefScore });
      const totalScore = Number(
        leetcodeScore + codechefScore + codeforcesScore
      );

      return {
        _id: user._id,
        name: user.name,
        username: user.username,
        image: user.picture,
        leetcodeScore,
        codeforcesScore,
        codechefScore,
        totalScore,
        lcStats,
        cfStats,
        ccStats,
      };
    })
  );

  leaderboardData.sort((a, b) => {
    if (filter === "leetcode") {
      if (b.leetcodeScore != a.leetcodeScore) {
        return b.leetcodeScore - a.leetcodeScore;
      }
      if (b.codeforcesScore != a.codeforcesScore) {
        return b.codeforcesScore - a.codeforcesScore;
      }
      return b.codechefScore - a.codechefScore;
    }

    if (filter === "codechef") {
      if (b.codechefScore != a.codechefScore) {
        return b.codechefScore - a.codechefScore;
      }
      if (b.codeforcesScore != a.codeforcesScore) {
        return b.codeforcesScore - a.codeforcesScore;
      }
      return b.leetcodeScore - a.leetcodeScore;
    }

    if (filter === "codeforces") {
      if (b.codeforcesScore != a.codeforcesScore) {
        return b.codeforcesScore - a.codeforcesScore;
      }
      if (b.codechefScore != a.codechefScore) {
        return b.codechefScore - a.codechefScore;
      }
      return b.leetcodeScore - a.leetcodeScore;
    }
    // Default: "overall"
    const aTotal = a.leetcodeScore + a.codeforcesScore + a.codechefScore;
    const bTotal = b.leetcodeScore + b.codeforcesScore + b.codechefScore;

    if (bTotal !== aTotal) {
      return bTotal - aTotal; // Sort by total score
    }

    if (b.codeforcesScore !== a.codeforcesScore) {
      return b.codeforcesScore - a.codeforcesScore;
    }

    if (b.codechefScore !== a.codechefScore) {
      return b.codechefScore - a.codechefScore;
    }

    return b.leetcodeScore - a.leetcodeScore;
  });

  // console.log("filter" ,filter);
  //  console.log(`sorted list ${leaderboardData}`);
  const top3 = leaderboardData.slice(0, 3);
  // const remaining =leaderboardData.slice(3);
  const currentUser = leaderboardData.find(
    (ele) => ele._id.toString() === mongoUser?._id.toString()
  );
  console.log("current user", currentUser);
  top3.map((item) => {
    console.log("items ", item);
  });

  return (
    <div>
      <div className="flex justify-start mt-3">
        <DashboardFilters />
      </div>
      <div className="bg-light-900 dark:bg-dark-200 p-4 rounded-xl shadow-md mt-6">
        
        {/* Top 3 Container */}
        <div className="flex flex-col sm:flex-row justify-center items-end gap-4 sm:gap-8 relative w-full max-w-3xl mx-auto">
          {/* Second Place */}
          <div className="flex flex-col items-center mb-2 sm:mb-0 relative">
            <div className="absolute -top-5 z-10">
              <div className="text-xl" style={{ color: "#C0C0C0" }}>
                👑
              </div>
            </div>
            <div className="size-12 rounded-full overflow-hidden border-2 border-lime-400 shadow-sm transition-transform duration-300 hover:scale-110">
              <img
                src={top3[1].image || "/default-avatar.png"}
                alt="avatar"
                className="object-cover size-full"
              />
            </div>
            <div className="text-sm font-semibold mt-1 text-dark400_light700">
              {top3[1].name}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(
                filter === "leetcode"
                  ? top3[1].leetcodeScore
                  : filter === "codeforces"
                  ? top3[1].codeforcesScore
                  : filter === "codechef"
                  ? top3[1].codechefScore
                  : top3[1].totalScore
              )}{" "}
              pts
            </div>
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center relative">
            <div className="absolute top-[-26px] z-10">
              <div className="text-2xl" style={{ color: "#FFD700" }}>
                👑
              </div>
            </div>
            <div className="size-20 rounded-full overflow-hidden border-2 border-lime-400 shadow-md transition-transform duration-300 hover:scale-110">
              <img
                src={top3[0].image || "/default-avatar.png"}
                alt="avatar"
                className="object-cover size-full"
              />
            </div>
            <div className="text-base font-bold mt-1 text-dark400_light700">
              {top3[0].name}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(
                filter === "leetcode"
                  ? top3[0].leetcodeScore
                  : filter === "codeforces"
                  ? top3[0].codeforcesScore
                  : filter === "codechef"
                  ? top3[0].codechefScore
                  : top3[0].totalScore
              )}{" "}
              pts
            </div>
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center mt-2 sm:mt-0 relative">
            <div className="absolute -top-5 z-10">
              <div className="text-xl" style={{ color: "#CD7F32" }}>
                👑
              </div>
            </div>
            <div className="size-12 rounded-full overflow-hidden border-2 border-lime-400 shadow-sm transition-transform duration-300 hover:scale-110">
              <img
                src={top3[2].image || "/default-avatar.png"}
                alt="avatar"
                className="object-cover size-full"
              />
            </div>
            <div className="text-sm font-semibold mt-1 text-dark400_light700">
              {top3[2].name}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(
               filter === "leetcode"
                  ? top3[2].leetcodeScore
                  : filter === "codeforces"
                  ? top3[2].codeforcesScore
                  : filter === "codechef"
                  ? top3[2].codechefScore
                  : top3[2].totalScore
              )}{" "}
              pts
            </div>
          </div>
        </div>
      </div>

      {/* Filters Below */}
      

      
    </div>
  );
};

export default Page;
