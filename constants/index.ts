import SunImage from "@/assets/icons/sun.svg";
import MoonImage from "@/assets/icons/moon.svg";
import ComputerImage from "@/assets/icons/computer.svg";
import HomeIcon from "@/assets/icons/home.svg";
import UsersIcon from "@/assets/icons/users.svg";
import { SidebarLink } from "@/types/";
import UserIcon from "@/assets/icons/user.svg";
import TagIcon from "@/assets/icons/tag.svg";
import SuitcaseIcon from "@/assets/icons/ranking-stroke-rounded.svg";
import StarIcon from "@/assets/icons/star.svg";
import QuestionIcon from "@/assets/icons/question.svg"; 


export const themes = [
  {
    value: "light",
    label: "Light",
    icon: SunImage,
  },
  {
    value: "dark",
    label: "Dark",
    icon: MoonImage,
  },
  {
    value: "system",
    label: "System",
    icon: ComputerImage,
  },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: HomeIcon,
    route: "/",
    label: "Home",
  },
  {
    imgURL: UsersIcon,
    route: "/community",
    label: "Community",
  },
  {
    imgURL: StarIcon,
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: SuitcaseIcon,
    route: "/leaderboard",
    label: "Leaderboard",
  },
  {
    imgURL: TagIcon,
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: UserIcon,
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: QuestionIcon,
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
