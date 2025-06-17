/* eslint-disable tailwindcss/classnames-order */
import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center text-dark100_light900">
      <AlertCircle className="size-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-md">
        Your dashboard is empty because your profile is not verified yet.
        Please edit your profile and add your platform IDs to see your analytics.
      </p>
      <button className="bg-orange-500 text-white font-medium py-2 px-4 rounded-[8px] transition-all duration-300 hover:scale-105 hover:bg-green-600">
        <Link href="/profile/edit">
          Go to Edit Profile
      </Link>
      </button>
    </div>
  );
};

export default NoData;
