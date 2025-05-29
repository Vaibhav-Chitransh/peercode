"use client";
import { HomePageFilters } from "@/constants/filters";
import React from "react";

const HomeFilters = () => {
  const active = "frequent";

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <button
          key={item.value}
          onClick={() => {}}
          className={`body-medium rounded-[5px] px-6 py-3 capitalize shadow-none ${active === item.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500"} `}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default HomeFilters;
