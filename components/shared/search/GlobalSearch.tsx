/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client" // temporary
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import SearchImage from "../../../assets/icons/search.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formURLQuery, RemoveKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
   const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
   const searchContainerRef =useRef(null);
    const query = searchParams.get("q");
    const [search, setSearch] = useState(query || "");
    const [isOpen ,setIsOpen]=useState(false);

    useEffect(()=>{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleOutsideClick = (event : any)=>{
        if(searchContainerRef.current && 
          // @ts-expect-error
          !searchContainerRef.current.contains(event.target)
        ){
          setIsOpen(false)
          setSearch('')
        }
      }
      setIsOpen(false);

      document.addEventListener("click",handleOutsideClick);
      return ()=>{
        document.removeEventListener("click",handleOutsideClick)
      }
    },[pathname])
  

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (search) {
          const newUrl = formURLQuery({
            params: searchParams.toString(),
            key: 'global',
            value: search,
          });
          router.push(newUrl, { scroll: false });
        } else {
            if(query){
                const newUrl =RemoveKeysFromQuery({
                  params: searchParams.toString(),
                  keysToRemove: ['global','type'],
                })
                router.push(newUrl, { scroll: false });
            }
        }
      }, 300);
  
      return () => clearTimeout(delayDebounceFn);
    }, [search, pathname, router, searchParams, query]);

    
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden " ref={searchContainerRef}>
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
            src={SearchImage}
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"
 
        />
        <input  
            type="text"
            placeholder="Search  globally"
            value={search}
            onChange={(e) =>{
               setSearch(e.target.value);
              if(!isOpen) setIsOpen(true);
              if(e.target.value === '' && isOpen){
                setIsOpen(false);
              }
            }
            } 
            className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none placeholder:text-gray-500"
        />

      </div>
      {isOpen && <GlobalResult/> }
    </div>
  );
};

export default GlobalSearch;
