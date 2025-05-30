"use client";
import React, { useEffect, useState, createContext, useContext } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<string>("light"); 


  const handleThemeChange = () =>{
    if(
      localStorage.theme==='dark' || 
      (!("theme" in localStorage) && 
        window.matchMedia("(prefers-color-scheme :dark)").matches)
        // this lines checks whether dark theme is supported in your system or not
    ){
      setMode('dark');
      document.documentElement.classList.add("dark");
    }else{
      setMode('light');
      document.documentElement.classList.remove("dark");
    }
  }

  useEffect(()=>{
    handleThemeChange();
  },[mode])
  // useEffect(() => {
  //   if (mode === "dark") {
  //     document.documentElement.classList.add("dark");
  //     document.documentElement.classList.remove("light");
  //   } else {
  //     document.documentElement.classList.add("light");
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
