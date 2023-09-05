import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}): JSX.Element {
  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    window.location.search = params.toString();
  };
  let max = Math.min(currentPage + 5, totalPages);
  let min = Math.max(currentPage - 5, 1);
  let range = [];

  currentPage = Math.max(currentPage, 1);
  let wtf = currentPage > totalPages && currentPage > 1;

  for (let i = min; i <= max; i++) {
    range.push(i);
  }
  return (
    <div className="flex justify-start gap-2 px-4 py-2">
      {wtf ? (
        <div className="">
          What are you doing? Go back to{" "}
          <button onClick={() => goToPage(1)}>
            <span className="text-lightAccent">page [1]</span>
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage == 1}
            className="disabled:opacity-50 bg-primaryLight p-2 py-px rounded-md disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {range.map((page) => {
            return currentPage == page ? (
              <button key={page} onClick={() => goToPage(page)}>
                <span className="text-lightAccent">[{page}]</span>
              </button>
            ) : (
              <button key={page} onClick={() => goToPage(page)}>
                <span className="text-black  hover:text-darkAccent">
                  [{page}]
                </span>
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage == totalPages}
            className="disabled:opacity-50 bg-primaryLight p-2 rounded-md disabled:cursor-not-allowed"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}
