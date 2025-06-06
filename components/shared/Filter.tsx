"use client";
import React from "react";

interface filterProps {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: filterProps) => {
  const selectId = "filter-select";

  return (
    <div className={`group relative ${containerClasses}`}>
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full cursor-pointer appearance-none rounded-xl
            border border-gray-300/60 bg-gray-100/80
            px-4
            py-3 pr-12
            text-sm font-medium
            text-gray-700 backdrop-blur-sm
            transition-all duration-200
            ease-in-out
            hover:border-gray-400/80 hover:bg-gray-200/60 focus:border-blue-500/60
            focus:outline-none focus:ring-2 focus:ring-blue-500/40
            dark:border-gray-700/60 dark:bg-gray-800/50
            dark:text-gray-200 dark:hover:border-gray-600/80
            dark:hover:bg-gray-800/70 dark:focus:border-blue-500/60
            ${otherClasses}
          `}
          defaultValue=""
        >
          <option
            value=""
            disabled
            className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          >
            Select a Filter
          </option>
          {filters.map((item) => (
            <option
              key={item.value}
              value={item.value}
              className="
                bg-gray-100 font-medium 
                text-gray-700 hover:bg-gray-200
                dark:bg-gray-800
                dark:text-gray-200 dark:hover:bg-gray-700
              "
            >
              {item.name}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            className="size-4 text-gray-500 transition-colors duration-200 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Filter;
