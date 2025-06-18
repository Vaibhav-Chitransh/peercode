import LeftSideBar from "@/components/shared/LeftSideBar"
import Navbar from "@/components/shared/Navbar"
import RightSideBar from "@/components/shared/RightSideBar"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <Suspense fallback={<div>Loading Left Sidebar...</div>}>
          <LeftSideBar />
        </Suspense>

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">
              {children}
          </div>
        </section>

        <Suspense fallback={<div>Loading Right Sidebar...</div>}>
          <RightSideBar />
        </Suspense>
      </div>

      <Toaster />
    </main>
  )
}

export default Layout