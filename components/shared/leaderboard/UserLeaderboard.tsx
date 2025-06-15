/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserLeaderboardProps } from '@/types'
import React from 'react'

const UserLeaderboard = ({currentUser ,currentUserRank}: UserLeaderboardProps) => {
  return (
  <div className="relative mx-auto mb-6 flex h-20 w-full max-w-4xl items-center justify-between rounded-[10px] bg-light-900 px-3 pt-2 text-white shadow-md dark:bg-dark-200">
  
     <div className="absolute left-2 top-0 rounded-bl-md rounded-tr-md bg-pink-100 px-2 py-[2px] text-[10px] font-bold tracking-wide text-primary-500 dark:bg-white">
        MY RANK
      </div>
  {/* User Info */}
  <div className="flex items-center gap-3">
    <img
      src={currentUser.image || "/default-avatar.png"}
      className="size-12 rounded-full border-2 border-lime-400"
      alt="avatar"
    />
    <div>
      <p className="paragraph-semibold text-dark300_light700">{currentUser.name}</p>
      <p className="text-xs text-gray-400">@{currentUser.username}</p>
    </div>
  </div>

  {/* Scores */}
  <div className="space-y-1 text-right">
    <div className="flex items-center justify-end gap-6">
      <div>
        <p className="text-dark300_light700 mr-2 text-sm font-semibold">P Score</p>
        <p className="text-dark300_light700 mr-3 text-[12px] font-bold">
          {currentUser?.pScore.toFixed(1)}
        </p>
      </div>
      <div>
        <p className="text-dark300_light700 mr-2 text-sm font-semibold">Rank</p>
        <p className="text-dark300_light700 mr-4 text-[12px] font-bold">#{currentUserRank}</p>
      </div>
    </div>
  </div>
</div>
  )
}

export default UserLeaderboard