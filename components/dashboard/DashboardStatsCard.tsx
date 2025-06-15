/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */
import { Trophy, Target, Globe } from "lucide-react";

type StatType = "questions" | "contests" | "ranking";

interface DashboardStatsCardProps {
  type: StatType;
  count: number | undefined;
}

export const DashboardStatsCard = ({ type, count }: DashboardStatsCardProps) => {
  const isQuestions = type === "questions";
  const isContests = type === "contests";
  const isRanking = type === "ranking";

  const bgClass = isQuestions
    ? "bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50"
    : isContests
    ? "bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50"
    : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50";

  const iconColorClass = isQuestions
    ? "text-orange-600 dark:text-orange-400"
    : isContests
    ? "text-purple-600 dark:text-purple-400"
    : "text-blue-600 dark:text-blue-400";

  const label = isQuestions
    ? "Questions"
    : isContests
    ? "Contests"
    : "Global Rank";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group">
      <div className="flex gap-3 justify-center items-center">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${bgClass}`}
          >
            {isQuestions ? (
              <Target className={`w-6 h-6 ${iconColorClass}`} />
            ) : isContests ? (
              <Trophy className={`w-6 h-6 ${iconColorClass}`} />
            ) : (
              <Globe className={`w-6 h-6 ${iconColorClass}`} />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {(isRanking) ? <span></span> : <span>Total</span>} {label}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {count}
            </p>
          </h3>
        </div>
      </div>
    </div>
  );
};
