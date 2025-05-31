"use client"
import { sidebarLinks } from "@/constants/index";
import React from "react";
import { SheetClose } from "../ui/sheet";
import  Link  from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
const NavContent = () => {
  const pathName=usePathname();
  return (
    <section className="flex h-full flex-col gap-6  pt-16 ">
      {sidebarLinks.map((item) => {
        const isActive=(pathName.includes(item.route) && item.route.length>1) || pathName===item.route;
        return (
          <SheetClose asChild key={item.route}>
            <Link href={item.route} className={`${isActive ? 'primary-gradient rounded-lg text-light-900':'text-dark300_light900'} flex items-center justify-start gap-4 bg-transparent p-4`}>
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive?"":"invert-colors"}`}
              />
              <p className={`${isActive?'base-bold' :'base-medium '}`}>{item.label}</p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

export default NavContent;
