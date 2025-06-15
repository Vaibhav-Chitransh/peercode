/* eslint-disable @typescript-eslint/no-explicit-any */
import DefaultAvatar from "../public/avatar_default.webp";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_REST_URL = "https://api.github.com";

export async function getCodeforcesStats(handle: string | undefined) {
  try {
    // Fetch user info
    const userInfoRes = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const userData = await userInfoRes.json();
    const userPic: string = userData.result[0].titlePhoto;
    const name: string =
      userData.result[0].firstName + " " + userData.result[0].lastName;
    const level: string = userData.result[0].rank;

    // Fetch submissions
    const resSub = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}`
    );
    const dataSub = await resSub.json();
    if (dataSub.status !== "OK")
      throw new Error(dataSub.comment || "Error fetching submissions");

    // Fetch rating history
    const resHist = await fetch(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );
    const dataHist = await resHist.json();
    if (dataHist.status !== "OK")
      throw new Error(dataHist.comment || "Error fetching rating history");

    const submissions: any[] = dataSub.result;
    const ratingChanges: any[] = dataHist.result;

    const solvedSet = new Set<string>();
    const topicCounts: Record<string, number> = {};
    const solvedByRating: Record<number, number> = {};
    const heatmap: Record<string, number> = {};
    let totalSolved = 0;
    let highestRating = 0;

    for (const sub of submissions) {
      if (sub.verdict !== "OK") continue;

      const pid = `${sub.problem.contestId}-${sub.problem.index}`;
      if (solvedSet.has(pid)) continue;
      solvedSet.add(pid);
      totalSolved++;

      // Tags
      for (const tag of sub.problem.tags as string[]) {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      }

      // Ratings
      const rating = sub.problem.rating ?? 0;
      solvedByRating[rating] = (solvedByRating[rating] || 0) + 1;

      // Heatmap
      const date = new Date(sub.creationTimeSeconds * 1000)
        .toISOString()
        .slice(0, 10);
      heatmap[date] = (heatmap[date] || 0) + 1;
    }

    // Contest History
    const contestHistory = ratingChanges.map((c) => {
      if (c.newRating > highestRating) highestRating = c.newRating;
      return {
        contestId: c.contestId,
        contestName: c.contestName,
        date: new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
        oldRating: c.oldRating,
        newRating: c.newRating,
        delta: c.newRating - c.oldRating,
        rank: c.rank,
      };
    });

    const currRating = ratingChanges[ratingChanges.length - 1]?.newRating || 0;

    return {
      currRating,
      level,
      name,
      userPic,
      handle,
      totalSolved,
      topics: topicCounts,
      solvedByRating,
      heatmap,
      highestRating,
      contestCount: contestHistory.length,
      contestHistory,
    };
  } catch (err) {
    console.error(err);
    return { handle, error: (err as Error).message };
  }
}

export async function getLeetCodeStats(username: string | undefined) {
  try {
    // 1️⃣ Fetch core stats and avatar via GraphQL
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/${username}/`,
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        query: `
          query userStats($username: String!) {
            matchedUser(username: $username) {
              profile { userAvatar }
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              topPercentage
            }
            userContestRankingHistory(username: $username) {
              contest { title startTime }
              rating
              attended
              ranking
            }
          }
        `,
        variables: { username },
      }),
    });

    if (!response.ok) throw new Error(`Failed to fetch stats for ${username}`);
    const json = await response.json();

    const mu = json.data.matchedUser;
    const cr = json.data.userContestRanking;
    const history = json.data.userContestRankingHistory;
    if (!mu) throw new Error(`User ${username} not found`);

    // 2️⃣ Aggregate difficulty stats
    const stats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
    for (const { difficulty, count } of mu.submitStats.acSubmissionNum)
      stats[difficulty as keyof typeof stats] =
        difficulty === "All" ? (stats.Total = count) : count;

    const highestRating = cr?.rating || 0;
    let prevRating = 0;

    // 3️⃣ Format contest history
    const ratingHistory = (history || [])
      .filter((c: any) => c.attended)
      .map((c: any) => {
        const delta = Math.round(c.rating - prevRating);
        prevRating = c.rating;

        return {
          title: c.contest.title,
          date: new Date(c.contest.startTime * 1000).toLocaleDateString(),
          rating: Math.round(c.rating),
          highestRating: Math.round(Math.max(c.rating, highestRating)),
          delta,
          rank: c.ranking ?? "N/A",
        };
      });

    // 5️⃣ Return combined data
    return {
      profilePic: mu.profile?.userAvatar ?? DefaultAvatar,
      ...stats,
      highestRating: Math.round(highestRating),
      contestRating: Math.round(cr?.rating || 0),
      globalRank: Math.round(cr?.globalRanking || 0),
      topPercent: Math.round(cr?.topPercentage || 0),
      contests: Math.round(cr?.attendedContestsCount || 0),
      ratingHistory,
    };
  } catch (err) {
    console.error(err);
    return { error: (err as Error).message };
  }
}

export async function getCodechefStats(username: string | undefined) {
  try {
    const res = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    if (!res.ok) throw new Error("Failed to fetch CodeChef stats");

    const data = await res.json();

    return {
      profilePic: data.profile ?? DefaultAvatar,
      name: data.name,
      currentRating: data.currentRating,
      highestRating: data.highestRating,
      stars: data.stars,
      globalRank: data.globalRank,
      countryRank: data.countryRank,
      heatmap: data.heatmap ?? [],
      ratingData: data.ratingData ?? [],
    };
  } catch (err) {
    console.error(err);
    return { username, error: (err as Error).message };
  }
}

export async function getGithubStats(username: string | undefined) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  // 📊 GraphQL: Commits, PRs, Heatmap, Avatar
  const graphQLQuery = {
    query: `
      query {
        user(login: "${username}") {
          avatarUrl
          name
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  color
                  contributionCount
                  date
                }
              }
            }
          }
          pullRequests {
            totalCount
          }
        }
      }
    `,
  };

  const graphQLRes = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(graphQLQuery),
  });

  const graphQLData = await graphQLRes.json();
  const user = graphQLData.data.user;

  const contributions = user.contributionsCollection.contributionCalendar;
  const totalCommits = contributions.totalContributions;
  const heatmap = contributions.weeks.flatMap((w: any) => w.contributionDays);
  const totalPRs = user.pullRequests.totalCount;
  const profilePic = user.avatarUrl;

  // 📁 REST API: Repos Info
  const reposRes = await fetch(
    `${GITHUB_REST_URL}/users/${username}/repos?per_page=100`,
    { headers }
  );
  const repos = await reposRes.json();

  const totalRepos = repos.length;
  const totalStars = repos.reduce(
    (sum: number, repo: any) => sum + repo.stargazers_count,
    0
  );

  // 🧠 Language % Calculation
  const langMap: Record<string, number> = {};
  for (const repo of repos) {
    if (!repo.fork) {
      const langRes = await fetch(repo.languages_url, { headers });
      const langData = await langRes.json();
      for (const [lang, size] of Object.entries(langData)) {
        langMap[lang] = (langMap[lang] || 0) + Number(size);
      }
    }
  }

  const totalLangSize = Object.values(langMap).reduce((a, b) => a + b, 0);
  const languagePercentage = Object.entries(langMap).map(([lang, size]) => ({
    language: lang,
    percentage: ((size / totalLangSize) * 100).toFixed(2),
  }));

  return {
    name: user.name,
    profilePic,
    totalCommits,
    totalPRs,
    totalRepos,
    totalStars,
    heatmap,
    languagePercentage,
  };
}