import Navbar from "@/components/shared/Navbar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import React from "react";

const SIDEBAR_WIDTH = 320;
const NAVBAR_HEIGHT = 64;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar />
      {/* Left Sidebar */}
      <aside
        className="fixed left-0 z-20 hidden pt-8 md:block"
        style={{
          width: SIDEBAR_WIDTH,
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <LeftSideBar />
      </aside>

      {/* Right Sidebar */}
      <aside
        className="fixed right-0 z-20 hidden pt-8 lg:block"
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
          marginLeft: SIDEBAR_WIDTH,
          marginRight: SIDEBAR_WIDTH,
          paddingTop: 136,
          paddingBottom: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div className="w-full">{children}</div>
      </section>
    </main>
  );
};

export default Layout;