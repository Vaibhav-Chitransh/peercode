import { BADGE_CRITERIA } from "@/constants";
export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}
export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}
export interface Country {
  name: {
    common: string;
  };
}
export interface ParamsProps {
  params: { id: string };
}
export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}
export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}
export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export interface LeetCodeStats {
  Easy?: number;
  Medium?: number;
  Hard?: number;
  ContestRating?: number | null; // <- allow null
  GlobalRank?: number | null;
  TopPercent?: number | null;
  Contests?: number | null;
  ContestHistory?: number | null;
  Total?: number;
  username?: string;
}
export interface CodeforcesStats {
  solvedByRating: Record<number, number>;
  contestHistory?: { newRating: number }[];
}

export interface UserStats {
  _id: string;
  name: string;
  username: string;
  image: string;
  leetcodeScore: number;
  codeforcesScore: number;
  pScore: number;
  lcStats: LeetCodeStats | { error: string };
  cfStats: CodeforcesStats | { error: string };
}

export interface UserLeaderboardProps {
  currentUser: UserStats;
  currentUserRank: number | null;
}
export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
