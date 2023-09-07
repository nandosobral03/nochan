import Divider from "@/components/Divider";
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import ThreadPreview from "@/components/ThreadPreview";
import { NoChanState } from "@/model/state.model";
import { Thread, ThreadPreviewModel } from "@/model/thread.model";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { AppContext } from "next/app";
import { useEffect, useState } from "react";

export default function Home({
  state,
  threads,
  totalThreads,
}: {
  state: NoChanState;
  threads: Thread[];
  totalThreads: number;
}) {
  const [page, setPage] = useState(0);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    if (page) {
      setPage(isNaN(+page) ? 0 : +page);
    }
  }, []);

  return (
    <Layout state={state}>
      <div className="w-full flex-grow flex flex-col justify-center items-center gap-3">
        {threads.length > 0 ? (
          threads.map((thread) => {
            return (
              <div key={thread.id} className="w-full">
                <ThreadPreview thread={thread} />
                <Divider />
              </div>
            );
          })
        ) : (
          <>
            <img src="/empty.png" className="w-1/2" />
            <div className="flex flex-col gap-2 items-center bg-primaryLight py-6 px-12 rounded-lg">
              <h1 className="text-2xl">No threads found</h1>
              <h3 className="text-xl">404 as they say</h3>
            </div>
          </>
        )}
      </div>
      <Pagination
        currentPage={+page}
        totalPages={Math.ceil(totalThreads / 10)}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  state: NoChanState;
}> = async (context) => {
  console.log("fetching data");
  console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/state/hash`);
  const query = context.query;
  const page = query.page ? +query.page : 1;
  const userIdCookie = getCookie("userId", context);
  const headers: Record<string, string> = {};

  if (page <= 0) {
    console.log("redirecting");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (userIdCookie) headers["user-id"] = userIdCookie;
  const threads = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/threads?page=${
      page - 1
    }&pageSize=10&orderBy=timestamp&order=desc`,
    { headers }
  );
  const state = (await data.json()) as NoChanState;
  const threadData = (await threads.json()) as {
    threads: ThreadPreviewModel[];
    total: number;
  };
  return {
    props: {
      state,
      threads: threadData.threads,
      totalThreads: threadData.total,
    },
  };
};
