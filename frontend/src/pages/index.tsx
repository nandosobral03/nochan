import Divider from "@/components/Divider";
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import ThreadPreview from "@/components/ThreadPreview";
import { NoChanState } from "@/model/state.model";
import { Thread } from "@/model/thread.model";
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
      {threads.map((thread) => {
        return (
          <div key={thread.id}>
            <ThreadPreview thread={thread} />
            <Divider />
          </div>
        );
      })}
      <Divider />
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
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/state/hash`);
  const query = context.query;
  const page = query.page ? +query.page : 1;

  const threads = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/threads?page=${
      page - 1
    }&pageSize=10&orderBy=timestamp&order=desc`
  );
  const state = (await data.json()) as NoChanState;
  const threadData = (await threads.json()) as {
    threads: Thread[];
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
