import Layout from "@/components/Layout";
import { NoChanState } from "@/model/state.model";
import { Thread } from "@/model/thread.model";
import { GetServerSideProps } from "next";

export default function Home({
  state,
  threads,
}: {
  state: NoChanState;
  threads: Thread[];
}) {
  return (
    <Layout state={state}>
      {threads.map((thread) => {
        return (
          <div key={thread.id}>
            <h1>{thread.id}</h1>
            <p>{thread.content}</p>
          </div>
        );
      })}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  state: NoChanState;
}> = async () => {
  const data = await fetch("http://127.0.0.1:3000/state/hash");

  const threads = await fetch(
    `http://127.0.0.1:3000/threads?page=0&pageSize=10&orderBy=timestamp&order=desc`
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
    },
  };
};
