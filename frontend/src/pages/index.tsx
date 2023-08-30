import Divider from "@/components/Divider";
import Layout from "@/components/Layout";
import ThreadPreview from "@/components/ThreadPreview";
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
            <ThreadPreview thread={thread} />
            <Divider />
          </div>
        );
      })}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  state: NoChanState;
}> = async () => {
  console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/state/hash`);

  const threads = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/threads?page=0&pageSize=10&orderBy=timestamp&order=desc`
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
