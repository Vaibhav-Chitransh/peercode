import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
interface Props {
  id: number;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({ id, name, totalQuestions, showCount }: Props) => {
  return (
    <div>
      <Link href={`/tags/${id}`} className="flex justify-between gap-2">
        <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-lg border-none px-4 py-2 uppercase">
          {name}
        </Badge>

        {showCount && (
          <p className="small-medium text-dark500_light700">{totalQuestions}</p>
        )}
      </Link>
    </div>
  );
};

export default RenderTag;
