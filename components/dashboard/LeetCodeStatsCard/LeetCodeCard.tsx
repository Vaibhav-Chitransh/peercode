/* eslint-disable tailwindcss/classnames-order */
import { getLeetCodeStats } from "@/lib/dashboardData";
import ProfileCard from "../ProfileCard";
import { DashboardStatsCard } from "../DashboardStatsCard";
import { RatingChartLC } from "./RatingChartLC";
import { LevelSolved } from "./LevelSolved";

interface Props {
  username: string | undefined;
  name: string | undefined;
}

const LeetCodeCard = async ({ username, name }: Props) => {
  const lcStats = await getLeetCodeStats(username);
  const profilePic = "profilePic" in lcStats ? lcStats.profilePic : undefined;

  let ratingHistory, contestRating, highestRating, contests, globalRank;
  if ("contestRating" in lcStats) {
    ({ ratingHistory, contestRating, highestRating, contests, globalRank } =
      lcStats);
  } else {
    ratingHistory = undefined;
    contestRating = undefined;
    highestRating = undefined;
    contests = undefined;
    globalRank = undefined;
  }

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <ProfileCard userPic={profilePic} username={username} name={name} />
        <DashboardStatsCard
          type="questions"
          count={"Total" in lcStats ? lcStats.Total : undefined}
        />
        <DashboardStatsCard type="contests" count={contests} />
      </div>

      {/* <HeatMapComponent heatmap={heatmap} /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RatingChartLC
            contestData={ratingHistory}
            highestRating={highestRating}
            currRating={contestRating}
          />
        </div>

        <div className="flex flex-col gap-4">
          <DashboardStatsCard type="ranking" count={globalRank} />

          {"Easy" in lcStats && "Medium" in lcStats && "Hard" in lcStats ? (
            <LevelSolved
              easy={lcStats.Easy}
              medium={lcStats.Medium}
              hard={lcStats.Hard}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default LeetCodeCard;
