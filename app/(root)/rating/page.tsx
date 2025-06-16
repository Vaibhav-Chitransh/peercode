"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ratingSections = [
  {
    title: "LeetCode",
    description:
      "LeetCode scores are based on the number and difficulty of problems solved, along with contest performance. Since LeetCode's contest rating changes are generally conservative compared to other platforms, we do not divide the contest rating delta by 2. This allows the effort on LeetCode to be fairly represented in our system.",
    breakdown: [
      "✔ Easy problems give \u003cstrong\u003e0.5 point\u003c/strong\u003e",
      "✔ Medium problems give \u003cstrong\u003e1 point\u003c/strong\u003e",
      "✔ Hard problems give \u003cstrong\u003e2 points\u003c/strong\u003e",
      "✔ Contest contribution: \u003cstrong\u003e(Rating - 1500)\u003c/strong\u003e"
    ],
    color: "text-yellow-500",
  },
  {
    title: "Codeforces",
    description:
      "Codeforces scores consider both problem tags and contest history. Since Codeforces problems are heavily tagged by difficulty, and contests are competitive with larger swings in ratings, we scale the rating contribution down by dividing it. This provides a balanced reflection of performance.",
    breakdown: [
      "✔ Problems \u003cstrong\u003e\u2264 1200\u003c/strong\u003e → 0.5 point",
      "✔ Problems \u003cstrong\u003e\u2264 1600\u003c/strong\u003e → 1 point",
      "✔ Problems \u003cstrong\u003e\u2264 1900\u003c/strong\u003e → 2 points",
      "✔ Problems \u003cstrong\u003e\u003e 1900\u003c/strong\u003e → 3 points",
      "✔ Contest contribution: \u003cstrong\u003e(New Rating - 800) / 2\u003c/strong\u003e"
    ],
    color: "text-blue-400",
  },
  {
     title: "GitHub",
    description:
      "GitHub contributions reflect the user's real-world coding activity through commits and pull requests. To fairly quantify effort, consistent contribution is rewarded — encouraging code maintenance, collaboration, and open-source activity.",
    breakdown: [
      "✔ Every <strong>5 commits</strong> → 1 point",
      "✔ Every <strong>2 pull requests</strong> → 1 point"
    ],
    color: "text-green-500",
  },
];

export default function RatingWorkingPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Header and Back Button */}
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-dark300_light700 text-3xl font-bold"
        >
          How the Leaderboard Rating Works?
        </motion.h1>

        <Link href="/leaderboard">
          <p className="cursor-pointer text-[15px] font-semibold text-primary-500">
            ← Back to Leaderboard
          </p>
        </Link>
      </div>

      {/* Intro Section */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-dark400_light700 mb-8 text-base"
      >
        The leaderboard rating system is designed to give a fair and motivating way
        to compare performance across platforms like LeetCode, Codeforces, and CodeChef.
        It accounts for both the difficulty of problems you solve and your contest ratings,
        turning them into a unified score. Here&apos;s how it works for each platform:
      </motion.p>

      {/* Rating Sections */}
      <div className="space-y-6">
        {ratingSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="rounded-xl border border-light-700 bg-light-900 p-6 shadow-md dark:border-dark-400 dark:bg-dark-300"
          >
            <h2 className={`mb-2 text-2xl font-semibold ${section.color}`}>
              {section.title}
            </h2>
            <p className="text-dark400_light700 mb-4">{section.description}</p>
            <ul className="text-dark300_light700 ml-6 list-disc space-y-1">
              {section.breakdown.map((point, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
