import { getCodechefStats } from "@/lib/dashboardData";
import ProfileCard from "../ProfileCard";

interface Props {
  username: string | undefined;
}

const CodechefCard = async ({ username }: Props) => {
  const ccStats = await getCodechefStats(username);
  const {profilePic, name} = ccStats;

  return (
    <>
      <div className="mb-8 flex gap-4">
        <ProfileCard userPic={profilePic} username={username} name={name} />
        {/* <DashboardStatsCard
          type="questions"
          count={"Total" in lcStats ? lcStats.Total : undefined}
        />
        <DashboardStatsCard type="contests" count={contests} /> */}
      </div>

      {/* <HeatMapComponent heatmap={heatmap} /> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div> */}
    </>
  );
};

export default CodechefCard;
