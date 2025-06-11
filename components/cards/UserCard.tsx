import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface userCardProps {
  user: {
    _id: string;
    clerkId: string;
    name: string;
    username: string;
    picture: string;
  };
}

const UserCard = async ({ user }: userCardProps) => {
  const interactedTags = await getTopInteractedTags({
    userId: user._id,
  });

  return (
    <Link 
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full"
    >
      <article className="background-light900_dark200 light-border flex size-full flex-col items-center justify-center rounded-2xl border p-8 transition-all hover:shadow-md">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5 flex min-h-[40px] items-center">
          {interactedTags.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {interactedTags.slice(0, 3).map((tag) => (
                <RenderTag 
                  key={tag._id} 
                  id={Number(tag._id)} 
                  name={tag.name}
                />
              ))}
              {interactedTags.length > 3 && (
                <span className="text-dark500_light500 text-sm">
                  +{interactedTags.length - 3}
                </span>
              )}
            </div>
          ) : (
            <Badge variant="secondary">
              No tags yet
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;