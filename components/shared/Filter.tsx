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
    <div className={`relative ${containerClasses}`}>
      <select
        id={selectId}
        className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        defaultValue=""
      >
        <option value="">Select a Filter</option>
        {filters.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
