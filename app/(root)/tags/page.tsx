import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import SearchIcon from "../../../assets/icons/search.svg";
import { TagFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import { getAllTags } from "@/lib/actions/tag.action";
import Link from "next/link";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import { Suspense } from "react";

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const params = await searchParams;
  const { results, isNext } = await getAllTags({
    searchQuery: params.q,
    filter: params.filter,
    page: params.page ? +params.page : 1,
  });
  // console.log({ results });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense>
          <LocalSearchbar
            route="/tags"
            iconPosition="left"
            imgSrc={SearchIcon}
            placeholder="Search for tags"
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={<div>Loading Filters...</div>}>
          <Filter
            filters={TagFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </Suspense>
      </div>

      <section className="mt-12">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((tag) => (
              <Link
                href={`/tags/${tag._id}`}
                key={tag._id}
                className="shadow-light100_darknone w-full"
              >
                <article className="background-light900_dark200 light-border flex size-full flex-col rounded-[8px] border p-8 transition-all hover:shadow-md">
                  <div className="background-light800_dark400 w-fit rounded-[4px] px-4 py-2">
                    <p className="paragraph-semibold text-dark300_light900 line-clamp-1">
                      {tag.name}
                    </p>
                  </div>

                  <div className="mt-4 flex-1">
                    <p className="small-medium text-dark400_light500">
                      <span className="body-semibold primary-text-gradient mr-2">
                        {tag.questions.length}+
                      </span>
                      Question{tag.questions.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Optional: Add a brief description if available */}
                  {tag.description && (
                    <p className="small-regular text-dark400_light900 mt-2 line-clamp-2">
                      {tag.description}
                    </p>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>

      <div className="mt-10">
        <Suspense fallback={<div>Loading Pagination...</div>}>
          <Pagination
            pageNumber={params?.page ? +params.page : 1}
            isNext={isNext}
          />
        </Suspense>
      </div>
    </>
  );
};

export default Tags;
