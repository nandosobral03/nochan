export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}): JSX.Element {
  if (currentPage < 1) currentPage = 1;
  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    window.location.search = params.toString();
  };
  console.log(totalPages);
  let max = Math.min(currentPage + 5, totalPages);
  let min = Math.max(currentPage - 5, 1);
  let range = [];
  for (let i = min; i <= max; i++) {
    range.push(i);
  }
  return (
    <div className="flex justify-start gap-2 px-4 py-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage == 1}
        className="disabled:opacity-50 bg-primaryLight p-1 py-px rounded-md disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {range.map((page) => {
        return currentPage == page ? (
          <button key={page} onClick={() => goToPage(page)}>
            <span className="text-primary text-lightAccent">[{page}]</span>
          </button>
        ) : (
          <button key={page} onClick={() => goToPage(page)}>
            <span className="text-primary hover:text-lightAccent">
              [{page}]
            </span>
          </button>
        );
      })}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage == totalPages}
        className="disabled:opacity-50 bg-primaryLight p-1.5 rounded-md disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
