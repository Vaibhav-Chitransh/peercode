"use client" // temporary
import React, { useState } from "react";
import Image from "next/image";

import SearchImage from "../../../assets/icons/search.svg";

const GlobalSearch = () => {
  const [val, setVal] = useState<string>("");  // temporary purpose
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
            src={SearchImage}
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"

        />
        <input  
            type="text"
            placeholder="Search  globally"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark500_light700 border-none shadow-none outline-none placeholder:text-gray-500"
        />

      </div>
    </div>
  );
};

export default GlobalSearch;
