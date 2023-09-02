import { NoChanState } from "@/model/state.model";
import { useModalStore } from "@/utils/store";
import { useState } from "react";
import CreateThreadModal from "./CreateThreadModal";

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
    setModal(<CreateThreadModal />);
  };

  return (
    <>
      <header className="flex justify-between items-center h-8 w-full px-4 shadow">
        <span
          className="text-sm h-full flex items-center"
          onMouseEnter={() => setShowHash(true)}
          onMouseLeave={() => setShowHash(false)}
        >
          {showHash ? (
            <p>{state.hash}</p>
          ) : (
            <p>Hosting replies from #{state.lowestId}</p>
          )}
        </span>
        <p>
          Everything you see was created after
          {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
      </header>
      <div className="flex flex-col justify-center items-center h-32 w-full px-4">
        <h1 className="text-4xl">/nc/ - NoChan</h1>
        <button
          className="py-2 px-4 rounded mt-4 hoverable text-white"
          onClick={handleCreate}
        >
          {!threadId ? (
            <span> Start a thread</span>
          ) : (
            <span>Reply to thread</span>
          )}
        </button>
      </div>
    </>
  );
}
