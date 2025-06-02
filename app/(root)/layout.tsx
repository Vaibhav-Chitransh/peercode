"use client";
import Navbar from "@/components/shared/Navbar";
import React, { useEffect, useState } from "react";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";

const SIDEBAR_WIDTH = 300; // px, adjust as needed
const NAVBAR_HEIGHT = 64; // px, adjust if your Navbar is a different height

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [leftMargin, setLeftMargin] = useState(0);
  const [rightMargin, setRightMargin] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setLeftMargin(window.innerWidth >= 768 ? SIDEBAR_WIDTH : 0);
      setRightMargin(window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="background-light850_dark100 relative min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar />
      {/* Fixed Left Sidebar */}
      <aside
        className="fixed left-0 z-20 hidden md:block pt-8"
        style={{
          width: SIDEBAR_WIDTH,
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <LeftSideBar />
      </aside>
      {/* Fixed Right Sidebar */}
      <aside
        className="fixed right-0 z-20 hidden lg:block pt-8"
        style={{
          width: SIDEBAR_WIDTH,
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <RightSideBar />
      </aside>
      {/* Center Content */}
      <section
        className="relative flex flex-col overflow-y-auto"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginLeft: leftMargin,
          marginRight: rightMargin,
          paddingTop: 136, // pt-8
          paddingBottom: 24, // pb-6
          paddingLeft: 24, // px-6
          paddingRight: 24, // px-6
        }}
      >
        <div className="w-full">{children}</div>
      </section>
      {/* Toaster */}
    </main>
  );
};

export default Layout;
