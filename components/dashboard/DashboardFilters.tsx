"use client";
import { DashboardPageFilters } from "@/constants/filters";
import { formURLQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import LeetCodeIcon from "@/assets/icons/leetcodeIcon.svg";
import CodeforcesIcon from "@/assets/icons/codeforcesIcon.svg";
import GithubIconLight from "@/assets/icons/githubIcon.svg";
import GithubIconDark from "@/assets/icons/github.svg";
import Image from "next/image";
import { useTheme } from "@/context/ThemeProvider";

const DashboardFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mode } = useTheme();

  // Set initial active filter from URL param
  const initialFilter = searchParams.get("filter") || "leetcode";
  const [active, setActive] = useState(initialFilter);

  React.useEffect(() => {
    setActive(initialFilter);
  }, [initialFilter]);

  const handleTypeClick = (item: string) => {
    if (active === item) {
      // If clicking the active filter, reset to default (leetcode)
      setActive("leetcode");
      const newUrl = formURLQuery({
        params: searchParams.toString(),
        key: "filter",
        value: "leetcode",
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formURLQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="hidden flex-wrap gap-3 md:flex">
      {DashboardPageFilters.map((item) => (
        <button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`body-medium rounded-[5px] px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500  hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          } `}
        >
          <span className="flex items-center justify-center gap-2">
            <Image
              src={
                item.value === "leetcode"
                  ? LeetCodeIcon
                  : item.value === "codeforces"
                    ? CodeforcesIcon
                      : item.value === "github" && mode === "light"
                        ? GithubIconLight
                        : item.value === "github" && mode === "dark"
                          ? GithubIconDark
                          : ""
              }
              alt={`${item.name} Icon`}
            />
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DashboardFilters;
