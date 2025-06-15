import { getGithubStats } from "@/lib/dashboardData";
import ProfileCard from "../ProfileCard";
import { DashboardStatsCard } from "../DashboardStatsCard";
import HeatMapComponent from "../HeatMap";
import { LanguageDist } from "./LanguageDist";

interface Props {
  username: string | undefined;
}

const GithubCard = async ({ username }: Props) => {
  const ghStats = await getGithubStats(username);
  const {
    name,
    profilePic,
    totalRepos,
    totalCommits,
    totalPRs,
    totalStars,
    heatmap,
    languagePercentage
  } = ghStats;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <ProfileCard userPic={profilePic} username={username} name={name} />
          <DashboardStatsCard type="repos" count={totalRepos} />
        </div>
        <div className="flex gap-4">
          <DashboardStatsCard type="commits" count={totalCommits} />
          <DashboardStatsCard type="pullRequests" count={totalPRs} />
          <DashboardStatsCard type="stars" count={totalStars} />
        </div>
      </div>

      <HeatMapComponent heatmap={heatmap} />

      <LanguageDist language={languagePercentage} />
    </>
  );
};

export default GithubCard;
