/* eslint-disable tailwindcss/classnames-order */
import Image from 'next/image'
import React from 'react'

interface Props {
    userPic: string | undefined;
    name: string | undefined;
    username: string | undefined;
}

const ProfileCard = ({userPic, name, username}: Props) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group">
        <div className="shrink-0">
          <Image
            src={userPic ?? "/default-avatar.png"}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        <div>
          <div className="text-lg font-semibold dark:text-light-900">
            {name}
          </div>
          <div className="text-sm dark:text-light-500">
            @{username}
          </div>
        </div>
      </div>
  )
}

export default ProfileCard
