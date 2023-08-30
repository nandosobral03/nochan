import { NoChanState } from "@/model/state.model";
import Header from "./Header";
import { ReactNode } from "react";
import Divider from "./Divider";

type LayoutProps = {
  state: NoChanState;
  children: ReactNode;
};

export default function Layout({ children, state }: LayoutProps) {
  return (
    <>
      <Header state={state} />
      <Divider />
      <main>{children}</main>
    </>
  );
}
