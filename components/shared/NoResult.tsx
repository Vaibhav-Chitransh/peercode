import Image from "next/image";
import React from "react";
import LightIllustration from "../../assets/images/light-illustration.png";
import DarkIllustration from "../../assets/images/dark-illustration.png";
import Link from "next/link";

interface NoResultProps {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: NoResultProps) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={LightIllustration}
        alt="No Result Illustration"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />

      <Image
        src={DarkIllustration}
        alt="No Result Illustration"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
      />

      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>

      <Link href={link} className="flex justify-end max-sm:w-full">
        <button className="mt-5 min-h-[46px] px-4 py-3 rounded-[8px] bg-primary-500 dark:bg-primary-500 paragraph-medium text-light-900 dark:text-light-900 hover:bg-primary-500">
          {linkTitle}
        </button>
      </Link>
    </div>
  );
};

export default NoResult;
