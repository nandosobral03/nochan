import { NoChanState } from "@/model/state.model";
import Header from "./Header";
import { ReactNode, useEffect } from "react";
import Divider from "./Divider";
import { useLoadingStore, useModalStore } from "@/utils/store";
import ModalContainer from "./Modals/ModalContainer";
import Head from "next/head";
import Loading from "./Loading";
import CreateReplyModal from "./Modals/CreateReplyModal";
import Script from "next/script";

type LayoutProps = {
  state: NoChanState;
  children: ReactNode;
  threadId?: string;
};

export default function Layout({ children, state, threadId }: LayoutProps) {
  const { modal, setModal } = useModalStore();
  const { loading } = useLoadingStore();

  useEffect(() => {
    document.addEventListener("idClicked", (e) => {
      const { threadId, id } = (e as CustomEvent).detail;
      if (!modal) {
        setModal(<CreateReplyModal threadId={threadId} id={id} />);
      }
    });
  });

  return (
    <>
      <Script src="https://www.google.com/recaptcha/enterprise.js?render=6LcoNfEnAAAAAHimi1dohLgmDKZQ0ADHTMroAqAP"></Script>
      <Head>
        <title>/nc/ - NoChan</title>
        <meta name="description" content="NoChan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header state={state} threadId={threadId} />
        <Divider />
        <main className="h-full flex-grow flex flex-col items-start w-full">
          {children}
        </main>
        {modal && <ModalContainer>{modal}</ModalContainer>}
        {loading && <Loading />}
      </div>
    </>
  );
}
