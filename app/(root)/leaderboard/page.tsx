/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tailwindcss/classnames-order */
import {
  getLeetCodeStats,
  getCodeforcesStats,
  getCodechefStats,
} from "@/lib/actions/user.action";
import React from "react";

const users = [
  {
    leetcode: "ayanokoji_kiyo",
    codeforces: "vaibhav_chitransh",
    codechef: "yagami_lightx",
  },
  {
    leetcode: "naveenchhipa",
    codeforces: "tourist",
    codechef: "potato167",
  },
  {
    leetcode: "jindal1203",
    codeforces: "jiangly",
    codechef: "noimi",
  },
  {
    leetcode: "Vishal__jain",
    codeforces: "Radewoosh",
    codechef: "sansen",
  },
  {
    leetcode: "akshanshjain",
    codeforces: "Benq",
    codechef: "nachia",
  },
];

type LeetCodeStats = {
  Easy: number;
  Medium: number;
  Hard: number;
  Total: number;
  ContestRating: number | null;
  GlobalRank: any;
  TopPercent: any;
  Contests: any;
  ContestHistory: any[];
  username: string;
  error?: undefined;
};

type CodeforcesStats = {
  totalSolved: number;
  topics: Record<string, number>;
  solvedByRating: Record<number, number>;
  contestCount: number;
  contestHistory: any[];
  error?: undefined;
};

type CodechefStats = {
  username: string;
  currentRating: number | null;
  highestRating: number | null;
  problemsSolved: number | null;
  contestCount?: number;
  contestHistory?: any[];
  error?: undefined;
};

type ErrorObject = {
  error: string;
};

const isError = (data: any): data is ErrorObject => "error" in data;

const Page = async () => {
  const leaderboardData = await Promise.all(
    users.map(async ({ leetcode, codeforces, codechef }) => {
      const [lcStats, cfStats, ccStats] = await Promise.all([
        getLeetCodeStats(leetcode),
        getCodeforcesStats(codeforces),
        getCodechefStats(codechef),
      ]);
      return {
        leetcode,
        codeforces,
        codechef,
        lcStats,
        cfStats,
        ccStats,
      };
    })
  );

  return (
    <>
    <div className="p-8">
      <h1 className="text-center text-2xl font-bold mb-6">
        Coding Leaderboard
      </h1>
      <div className="grid gap-4 max-w-4xl mx-auto">
        {leaderboardData.map((user, idx) => (
          <div
            key={idx}
            className="border p-4 rounded shadow bg-white dark:bg-dark-300"
          >
            <h2 className="font-semibold text-lg">{user.leetcode}</h2>

            {/* LeetCode Stats */}
            <div className="mb-4">
              <h3 className="font-semibold text-base text-yellow-600">
                🧠 LeetCode Stats
              </h3>
              {isError(user.lcStats) ? (
                <p className="text-red-500">{user.lcStats.error}</p>
              ) : (
                <>
                  <ul className="mt-1 space-y-1">
                    <li>✅ Easy: {user.lcStats.Easy}</li>
                    <li>🟡 Medium: {user.lcStats.Medium}</li>
                    <li>🔴 Hard: {user.lcStats.Hard}</li>
                    <li>📊 Total Solved: {user.lcStats.Total}</li>
                    <li>
                      🏆 Contest Rating: {user.lcStats.ContestRating ?? "N/A"}
                    </li>
                    <li>🌍 Global Rank: {user.lcStats.GlobalRank ?? "N/A"}</li>
                    <li>
                      🎯 Top %:{" "}
                      {user.lcStats.TopPercent
                        ? `${user.lcStats.TopPercent.toFixed(2)}%`
                        : "N/A"}
                    </li>
                    <li>📅 Contests: {user.lcStats.Contests}</li>
                  </ul>

                  {user.lcStats.ContestHistory?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">
                        📈 LeetCode Rating History:
                      </h4>
                      <ul className="text-sm mt-1 space-y-1">
                        {user.lcStats.ContestHistory.map(
                          (c: any, i: number) => (
                            <li key={i}>
                              {c.date} - {c.title}:{" "}
                              <span className="font-semibold">{c.rating}</span>
                              {" | Rank: "}
                              <span className="text-blue-500">{c.rank}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Codeforces Stats */}
            <div className="mb-4">
              <h3 className="font-semibold text-base text-blue-600">
                💻 Codeforces Stats
              </h3>
              {isError(user.cfStats) ? (
                <p className="text-red-500">{user.cfStats.error}</p>
              ) : (
                <>
                  <ul className="mt-1 space-y-1">
                    <li>📊 Total Solved: {user.cfStats.totalSolved}</li>
                    <li>
                      🏷️ Tags Covered:{" "}
                      {Object.keys(user.cfStats.topics).length}
                    </li>
                    <li>📈 Contests: {user.cfStats.contestCount}</li>
                  </ul>

                  {Object.keys(user.cfStats.solvedByRating).length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">📌 Solved by Rating:</h4>
                      <ul className="text-sm mt-1 flex flex-wrap gap-2">
                        {Object.entries(user.cfStats.solvedByRating).map(
                          ([rating, count]: any, i) => (
                            <li
                              key={i}
                              className="bg-gray-100 dark:bg-dark-100 px-2 py-1 rounded"
                            >
                              {rating}: {count}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {user.cfStats.contestHistory?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">📊 Contest History:</h4>
                      <ul className="text-sm mt-1 space-y-1">
                        {user.cfStats.contestHistory.map(
                          (c: any, i: number) => (
                            <li key={i}>
                              {c.date} - {c.contestName}:{" "}
                              <span className="font-semibold">
                                {c.newRating} ({c.delta >= 0 ? "+" : ""}
                                {c.delta})
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* CodeChef Stats */}
            <div>
              <h3 className="font-semibold text-base text-purple-600">
                🍽️ CodeChef Stats
              </h3>
              {isError(user.ccStats) ? (
                <p className="text-red-500">{user.ccStats.error}</p>
              ) : (
                <>
                  <ul className="mt-1 space-y-1">
                    <li>
                      📊 Current Rating:{" "}
                      {user.ccStats.currentRating ?? "N/A"}
                    </li>
                    <li>
                      🔝 Highest Rating:{" "}
                      {user.ccStats.highestRating ?? "N/A"}
                    </li>
                    <li>
                      🏆 Current Rating:{" "}
                      {user.ccStats.stars ?? "N/A"}
                    </li>
                    <li>
                      📅 Country Rank:{" "}
                      {user.ccStats.countryRank ?? "N/A"}
                    </li>
                  </ul>

                  {user.ccStats.contestHistory?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">📊 Contest History:</h4>
                      <ul className="text-sm mt-1 space-y-1">
                        {user.ccStats.contestHistory.map(
                          (c: any, i: number) => (
                            <li key={i}>
                              {c.date} - {c.contestName}:{" "}
                              <span className="font-semibold">
                                {c.oldRating} ➝ {c.newRating}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Page;
