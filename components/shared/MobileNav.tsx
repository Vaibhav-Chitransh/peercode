import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import NavContent from "./NavContent";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import HamburgerImage from "../../assets/icons/hamburger.svg";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={HamburgerImage}
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        ></Image>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none bg-white" 
      >
        <Link href="/" className="flex items-center gap-1">
          <Image src="/globe.svg" width={23} height={23} alt="peercode" />
          <p className="h2-bold text-dark100_light900 font-spaceGrotesk ">
            Peer<span className="text-primary-500">Code</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="primary-text-gradient"> Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="small-medium light-border-2  btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none ">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
        <SheetTitle className="sr-only">Main Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation drawer for PeerCode site
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
