"use client";
import { HomePageFilters } from "@/constants/filters";
import { formURLQuery} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const HomeFilters = () => {
  
  const searchParams=useSearchParams();
  const [active,setActive]=useState('');
  const router = useRouter();

  const handleTypeClick = ( item: string)=>{
     if (active === item) {
      setActive("");
          const newUrl = formURLQuery({
            params: searchParams.toString(),
            key: 'filter',
            value: null,
          });
          router.push(newUrl, { scroll: false });
        } else {
          setActive(item);
          const newUrl = formURLQuery({
            params: searchParams.toString(),
            key: 'filter',
            value: item.toLowerCase(),
          });
          router.push(newUrl, { scroll: false });
        } 
    }

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`body-medium rounded-[5px] px-6 py-3 capitalize shadow-none ${active === item.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500"} `}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default HomeFilters;
