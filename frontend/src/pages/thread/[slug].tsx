import Divider from "@/components/Divider";
import Layout from "@/components/Layout";
import ThreadView from "@/components/ThreadView";
import { NoChanState } from "@/model/state.model";
import { Thread } from "@/model/thread.model";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";

export default function ThreadPage({
  state,
  thread,
}: {
  state: NoChanState;
  thread: Thread;
}) {
  return (
    <Layout state={state} threadId={thread.id}>
      <ThreadView thread={thread} />
      <Divider />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  state: NoChanState;
  thread: Thread;
}> = async (context) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/state/hash`);
  const userIdCookie = getCookie("userId", context);
  const headers: Record<string, string> = {};
  if (userIdCookie) headers["user-id"] = userIdCookie;
  const slug = context.params!.slug;
  try {
    const thread = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/threads/${slug}`,
      { headers }
    );
    console.log(userIdCookie);
    const state = (await data.json()) as NoChanState;
    const threadData = (await thread.json()) as Thread;
    console.log(threadData);
    if (threadData.id !== slug)
      return {
        redirect: {
          destination: `/thread/${threadData.id}#${slug}`,
          permanent: true,
        },
      };

    return {
      props: {
        state,
        thread: threadData,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
