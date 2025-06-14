/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @next/next/no-img-element */
import React from "react";

const LeaderboardList = ({ user, index }:any) => {
  return (
    <div
      className="bg-dark-800 hover:bg-dark-700 mb-2 grid cursor-pointer grid-cols-3 items-center rounded-lg px-4 py-[6px] text-white shadow-sm transition-colors duration-200 hover:bg-light-900 dark:hover:bg-dark-200"
    >
      {/* Username & avatar */}
      <div className="flex items-center gap-4">
        <img
          src={user.image || "/default-avatar.png"}
          className="size-10 rounded-full border border-lime-400"
          alt="avatar"
        />
        <div>
          <p className="text-dark300_light700 text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-gray-400">@{user.username}</p>
        </div>
      </div>


      {/* Rank */}
      <div className="text-center font-bold">
        {index === 0 ? (
          <span className="text-yellow-400">🥇</span>
        ) : index === 1 ? (
          <span className="text-gray-300">🥈</span>
        ) : index === 2 ? (
          <span className="text-amber-700">🥉</span>
        ) : (
          <span className="text-dark400_light700">#{index + 1}</span>
        )}
      </div>

      {/* pScore */}
      <div className="text-dark300_light700 mr-2 text-right text-sm font-semibold">
        {user.pScore.toFixed(1)}
      </div>
      
    </div>
  );
};

export default LeaderboardList;
