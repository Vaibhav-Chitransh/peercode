import { getCodeforcesStats } from "@/lib/dashboardData";
import React from "react";
import { DashboardStatsCard } from "../DashboardStatsCard";
import ProfileCard from "../ProfileCard";
import HeatMapComponent from "../HeatMap";
import { RatingChart } from "../RatingChart";
import { RatingSegregation } from "../RatingSegregation";

interface Props {
  username: string | undefined;
}

const CodeforcesCard = async ({ username }: Props) => {
  const cfStats = await getCodeforcesStats(username);
  const {
    userPic,
    totalSolved,
    name,
    contestCount,
    heatmap,
    contestHistory,
    level,
    highestRating,
    topics,
    currRating,
    solvedByRating
  } = cfStats;

  console.log(topics);

  return (
    <>
      <div className="mb-8 flex gap-4">
        <ProfileCard userPic={userPic} username={username} name={name} />
        <DashboardStatsCard type="questions" count={totalSolved} />
        <DashboardStatsCard type="contests" count={contestCount} />
      </div>

      <HeatMapComponent heatmap={heatmap} />

      <RatingChart
        contestData={contestHistory}
        level={level}
        highestRating={highestRating}
        currRating={currRating}
      />

        <div className="mt-8">
          <RatingSegregation solvedByRating={solvedByRating} />
        </div>
    </>
  );
};

export default CodeforcesCard;