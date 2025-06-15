/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */
import {
  Trophy,
  Target,
  Globe,
  GitCommit,
  GitPullRequest,
  Star,
  FolderGit2,
} from "lucide-react";

type StatType =
  | "questions"
  | "contests"
  | "ranking"
  | "commits"
  | "pullRequests"
  | "stars"
  | "repos";

interface DashboardStatsCardProps {
  type: StatType;
  count: number | undefined;
}

const statConfig: Record<
  StatType,
  {
    label: string;
    bgClass: string;
    iconColor: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  questions: {
    label: "Questions",
    bgClass:
      "bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    Icon: Target,
  },
  contests: {
    label: "Contests",
    bgClass:
      "bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    Icon: Trophy,
  },
  ranking: {
    label: "Global Rank",
    bgClass:
      "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    Icon: Globe,
  },
  commits: {
    label: "Commits",
    bgClass:
      "bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    Icon: GitCommit,
  },
  pullRequests: {
    label: "PRs",
    bgClass:
      "bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    Icon: GitPullRequest,
  },
  stars: {
    label: "Stars",
    bgClass:
      "bg-pink-100 dark:bg-pink-900/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50",
    iconColor: "text-pink-600 dark:text-pink-400",
    Icon: Star,
  },
  repos: {
    label: "Repositories",
    bgClass:
      "bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    Icon: FolderGit2,
  },
};

export const DashboardStatsCard = ({
  type,
  count,
}: DashboardStatsCardProps) => {
  const { label, bgClass, iconColor, Icon } = statConfig[type];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group w-full">
      <div className="flex gap-3 justify-center items-center">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${bgClass}`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {type !== "ranking" && <span>Total </span>}
            {label}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {count}
            </p>
          </h3>
        </div>
      </div>
    </div>
  );
};
