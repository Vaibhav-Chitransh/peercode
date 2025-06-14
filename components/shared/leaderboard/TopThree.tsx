/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const TopThree = ({top3}:any) => {
  return (
      <div className="mx-auto mt-6 w-full max-w-4xl rounded-xl bg-light-900 p-4 shadow-md dark:bg-dark-200">
        {/* Top 3 Container */}
         <div className="relative flex w-full items-end justify-center gap-4 sm:flex-row sm:gap-8">
          {/* Second Place */}
          <div className="relative mb-2 flex flex-col items-center sm:mb-0">
            <div className="absolute -top-5 z-10">
              <div className="text-xl" style={{ color: "#C0C0C0" }}>
                👑
              </div>
            </div>
            <div className="size-12 overflow-hidden rounded-full border-2 border-lime-400 shadow-sm transition-transform duration-300 hover:scale-110 sm:size-14">
              <img
                src={top3[1].image || "/default-avatar.png"}
                alt="avatar"
                className="size-full object-cover"
              />
            </div>
            <div className="paragraph-semibold text-dark300_light700">
              {top3[1].name}
            </div>
            <div className="text-xs text-gray-500">
              {Number(top3[1]?.pScore)}{" "}
              pts
            </div>
          </div>

          {/* First Place */}
          <div className="relative flex flex-col items-center">
            <div className="absolute top-[-26px] z-10">
              <div className="text-2xl" style={{ color: "#FFD700" }}>
                👑
              </div>
            </div>
            <div className="size-20 overflow-hidden rounded-full border-2 border-lime-400 shadow-md transition-transform duration-300 hover:scale-110">
              <img
                src={top3[0].image || "/default-avatar.png"}
                alt="avatar"
                className="size-full object-cover"
              />
            </div>
            <div className="paragraph-semibold text-dark300_light700">
              {top3[0].name}
            </div>
            <div className="text-sm text-gray-500">
             {Number(top3[0]?.pScore)}{" "}
              pts
            </div>
          </div>

          {/* Third Place */}
          <div className="relative mt-2 flex flex-col items-center sm:mt-0">
            <div className="absolute -top-5 z-10">
              <div className="text-xl" style={{ color: "#CD7F32" }}>
                👑
              </div>
            </div>
            <div className="size-12 overflow-hidden rounded-full border-2 border-lime-400 shadow-sm transition-transform duration-300 hover:scale-110">
              <img
                src={top3[2].image || "/default-avatar.png"}
                alt="avatar"
                className="size-full object-cover"
              />
            </div>
            <div className="paragraph-semibold text-dark300_light700">
              {top3[2].name}
            </div>
            <div className="text-xs text-gray-500">
             {Number(top3[2]?.pScore)}{" "}
              pts
            </div>
          </div>
        </div>
      </div>

  )
}

export default TopThree