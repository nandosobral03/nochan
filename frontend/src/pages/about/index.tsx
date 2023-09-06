import Layout from "@/components/Layout";
import { NoChanState } from "@/model/state.model";
import { GetServerSideProps } from "next";

export default function About({ state }: { state: NoChanState }) {
  return (
    <Layout state={state}>
      <main className="flex flex-col items-start w-full flex-1 p-16">
        <h3 className="text-4xl ">About</h3>
        <p className="mt-3">
          This is a simple image board built with Next.js and Tailwind CSS. All
          threads and posts are deleted after 24 hours as well as their
          associated images. Annonymity is achieved by not requiring any user
          registration. IP addresses are not stored either. The only way to keep
          track of your posts is by a userId cookie that is stored in your
          browser the first time you create a thread or reply to one, you can at
          any time delete this cookie by clicking the refresh identity button.
          This will generate a new userId cookie and you will no longer be able
          to see (You)'s or identify your own posts. Source code can be found on
          <a href="www.github.com/nandosobral03/nochan">github</a>. Daily
          threads are created automatically at 00:00 UTC. These threads act as
          prompts for users to post images and discuss the topic of the day.
        </p>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  state: NoChanState;
}> = async (context) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/state/hash`);
  const state = (await data.json()) as NoChanState;
  return {
    props: {
      state,
    },
  };
};
