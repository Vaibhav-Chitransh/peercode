import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
interface Props {
  id: number;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
  asLink?: boolean; // New prop to control link rendering
}

const RenderTag = ({
  id,
  name,
  totalQuestions,
  showCount,
  asLink = true,
}: Props) => {
  const content = (
    <div className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-[5px] border-none px-4 py-2 uppercase">
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </div>
  );

  return asLink ? <Link href={`/tags/${id}`}>{content}</Link> : content;
};

export default RenderTag;
