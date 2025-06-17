/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import Filter from "@/components/shared/Filter";
import { DashboardPageFilters } from "@/constants/filters";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import CodeforcesCard from "@/components/dashboard/Codeforces/CodeforcesCard";
import LeetCodeCard from "@/components/dashboard/LeetCodeStatsCard/LeetCodeCard";
import { redirect } from "next/navigation";
import GithubCard from "@/components/dashboard/github/GithubCard";
import { URLProps } from "@/types";
import NoData from "@/components/dashboard/NoData";

const page = async ({ params, searchParams }: URLProps) => {
  const filter = searchParams.filter;

  if (!filter) {
    redirect(`/dashboard/${params.id}?filter=leetcode`);
  }

  const { userId: clerkId } = await auth();
  let mongoUser: {
    _id: any;
    leetcodeId?: string;
    codeforcesId?: string;
    githubId?: string;
    name?: string;
    codeforcesVerified: boolean;
    leetcodeVerified: boolean;
    githubVerified: boolean;
  } | null = null;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  if (!mongoUser) {
    return <div>Please sign in to access dashboard</div>;
  }

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
        mongoUser.codeforcesVerified ? (
          <CodeforcesCard username={mongoUser.codeforcesId} />
        ) : (
          <NoData />
        )
      ) : filter === "leetcode" ? (
        mongoUser.leetcodeVerified ? (
          <LeetCodeCard username={mongoUser.leetcodeId} name={mongoUser.name} />
        ) : (
          <NoData />
        )
      ) : filter === "github" ? (
        mongoUser.githubVerified ? (
          <GithubCard username={mongoUser.githubId} />
        ) : (
          <NoData />
        )
      ) : (
        <div className="text-dark100_light900">This Page does not exist</div>
      )}
    </div>
  );
};

export default page;
