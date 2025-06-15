/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import Filter from "@/components/shared/Filter";
import { DashboardPageFilters } from "@/constants/filters";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import CodeforcesCard from "@/components/dashboard/Codeforces/CodeforcesCard";
import LeetCodeCard from "@/components/dashboard/LeetCodeStatsCard/LeetCodeCard";
import CodechefCard from "@/components/dashboard/Codechef/CodechefCard";
import { redirect } from "next/navigation";
import GithubCard from "@/components/dashboard/github/GithubCard";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const filter = searchParams.filter;

  if (!filter) {
    redirect("/dashboard?filter=leetcode");
  }

  const { userId: clerkId } = await auth();
  let mongoUser: {
    _id: any;
    leetcodeId?: string;
    codeforcesId?: string;
    codechefId?: string;
    githubId?: string;
    name?: string;
  } | null = null;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  if (!mongoUser) {
    return <div>Please sign in to access dashboard</div>;
  }

  // let lcStats = null;
  // if (mongoUser.leetcodeId) {
  //   lcStats = await getLeetCodeStats(mongoUser.leetcodeId);
  // }

  // let cfStats = null;
  // if (mongoUser.codeforcesId) {
  //   cfStats = await getCodeforcesStats(mongoUser.codeforcesId);
  // }

  // let ccStats = null;
  // if (mongoUser.codechefId) {
  //   ccStats = await getCodechefStats(mongoUser.codechefId);
  // }

  // const totalQues = (lcStats?.Total ?? 0) + (cfStats?.totalSolved ?? 0);
  // const totalContests = (lcStats?.Contests ?? 0) + cfStats?.contestCount;

  // const ccStars = ccStats?.stars;
  // const globalRank = ccStats?.globalRank;

  return (
    <div>
      <div className="mb-4">
        <Filter
          filters={DashboardPageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />

        <DashboardFilters />
      </div>

      {filter === "codeforces" ? (
        <CodeforcesCard username={mongoUser.codeforcesId} />
      ) : filter === "leetcode" ? (
        <LeetCodeCard username={mongoUser.leetcodeId} name={mongoUser.name} />
      ) : filter === "codechef" ? (
        <CodechefCard username={mongoUser.codechefId} />
      ) : filter === 'github' ? (
        <GithubCard username={mongoUser.githubId} />
      ) : (
        <div>Coming soon</div>
      )}
    </div>
  );
};

export default page;
