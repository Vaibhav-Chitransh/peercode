import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex w-full min-h-screen items-center justify-center">
      {children}
    </main>
  );
};

export default Layout;
