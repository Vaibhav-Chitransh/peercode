import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();

  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMilliseconds / 1000);
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays} days ago`;
};

export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}

export function getJoinedDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
}


interface URLQueryParams{
  params: string;
  key: string;
  value: string | null; 
}

export const formURLQuery=({params,key,value}:URLQueryParams)=>{

  const currentURL = qs.parse(params);
  currentURL[key]=value;
  
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentURL,
  },
  {skipNull: true})
}

interface RemoveKeysFromQueryParams{
  params: string;
  keysToRemove: string[];
}

export const RemoveKeysFromQuery=({params,keysToRemove}:RemoveKeysFromQueryParams)=>{
  const currentURL=qs.parse(params);
  keysToRemove.forEach((key)=>{
    delete currentURL[key];
  })

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentURL,
  },
  {skipNull: true})
  
}