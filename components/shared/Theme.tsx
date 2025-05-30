"use client";
import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import SunImage from "../../assets/icons/sun.svg";
import MoonImage from "../../assets/icons/moon.svg";
import { themes } from "@/constants";

const Theme = () => {
  const { mode, setMode } = useTheme();

  return (
    <div>
      <Menubar className="relative border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
            {mode === "light" ? (
              <Image
                
                src={SunImage}
                alt="sun"
                width={20}
                height={20}
                className="active-theme cursor-pointer"
              />
            ) : (
              <Image
                src={MoonImage}
                alt="moon"
                width={20}
                height={20}
                className="active-theme cursor-pointer"
              />
            )}
          </MenubarTrigger>
          <MenubarContent className="absolute -right-12 mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300">
            {themes.map((theme) => (
              <MenubarItem
                key={theme.value}
                className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400 cursor-pointer"
                onClick={
                  () =>{ setMode(theme.value)
                  if(theme.value!=='system'){
                    localStorage.theme=theme.value
                  }else{
                      localStorage.removeItem('theme'); 
                  }}
                }
              >
                <Image
                  src={theme.icon}
                  alt={theme.label}
                  width={20}
                  height={20}
                  className={`${mode === theme.value && "active-theme"}`}
                />
                <p className={`body-semibold text-light-500 ${mode===theme.value?'text-primary-500':'text-dark100_light900'}`}>{theme.label}</p>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Theme;
