import { NoChanState } from "@/model/state.model";
import { useModalStore } from "@/utils/store";
import { useState } from "react";
import CreateThreadModal from "./Modals/CreateThreadModal";
import CreateReplyModal from "./Modals/CreateReplyModal";
import { PersonIcon, UpdateIcon } from "@radix-ui/react-icons";
import { deleteCookie } from "cookies-next";
export default function Header({
  state,
  threadId,
}: {
  state: NoChanState;
  threadId?: string;
}) {
  const [showHash, setShowHash] = useState(false);
  const { setModal } = useModalStore();
  const handleCreate = () => {
    if (threadId) setModal(<CreateReplyModal threadId={threadId} />);
    else setModal(<CreateThreadModal />);
  };

  const removeIdentity = () => {
    deleteCookie("userId");
    window.location.reload();
  };

  return (
    <>
      <header className="flex justify-between items-center h-8 min-w-screen px-4 shadow">
        {/* Hide if small screen */}
        <span
          className="text-sm h-full items-center hidden md:flex"
          onMouseEnter={() => setShowHash(true)}
          onMouseLeave={() => setShowHash(false)}
        >
          {showHash ? (
            <a href="/"> {state.hash} </a>
          ) : (
            <p>Hosting replies from #{state.lowestId}</p>
          )}
        </span>
        <p className="text-sm h-full items-center flex">
          {`Everything was created after ${new Date(
            Date.now() - 24 * 60 * 60 * 1000
          ).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}`}
        </p>
      </header>
      <div className="flex flex-col justify-center items-center h-32 w-full px-4">
        <h1 className="text-4xl">
          <a href="/">/nc/ - NoChan </a>
        </h1>
        <div className="flex mt-4 align-middle items-center gap-2">
          <button
            className="py-2 px-4 rounded hoverable text-white"
            onClick={handleCreate}
          >
            {!threadId ? (
              <span> Start a thread </span>
            ) : (
              <span> Reply to thread </span>
            )}
          </button>
          <button
            title="Refresh identity, this will reset your (You)"
            className="py-2 px-2 rounded hoverable-danger text-white flex relative items-center"
            onClick={removeIdentity}
          >
            <PersonIcon style={{ marginRight: "3px" }} />
            <UpdateIcon
              className="absolute top-0 right-0  w-2.5 h-2.5"
              style={{ marginTop: "5px", marginRight: "4px" }}
            />
          </button>
        </div>
      </div>
    </>
  );
}
