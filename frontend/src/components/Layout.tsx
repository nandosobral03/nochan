import { NoChanState } from "@/model/state.model";
import Header from "./Header";
import { ReactNode, useEffect } from "react";
import Divider from "./Divider";
import { useLoadingStore, useModalStore } from "@/utils/store";
import ModalContainer from "./ModalContainer";
import Head from "next/head";
import Loading from "./Loading";

type LayoutProps = {
  state: NoChanState;
  children: ReactNode;
  threadId?: string;
};

export default function Layout({ children, state, threadId }: LayoutProps) {
  const { modal } = useModalStore();
  const { loading } = useLoadingStore();
  return (
    <>
      <Head>
        <title>NoChan</title>
        <meta name="description" content="NoChan" />
        <script src="https://www.google.com/recaptcha/enterprise.js?render=6LcoNfEnAAAAAHimi1dohLgmDKZQ0ADHTMroAqAP"></script>
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header state={state} threadId={threadId} />
        <Divider />
        <main className="h-full flex-grow flex flex-col items-start">
          {children}
        </main>
        {modal && <ModalContainer>{modal}</ModalContainer>}
        {loading && <Loading />}
      </div>
    </>
  );
}
