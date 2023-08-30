import { NoChanState } from "@/model/state.model";
import { useState } from "react";

export default function Header({
  state,
  threadId,
}: {
  state: NoChanState;
  threadId?: string;
}) {
  const [showHash, setShowHash] = useState(false);

  return (
    <>
      <header
        className="flex justify-end items-center h-8 w-full px-4 shadow"
        // style={{ backgroundColor: "var(--primary)", color: "var(--text)" }}
      >
        {/* On hover swap out the hash for the lowest id */}
        <span
          className="text-sm h-full flex items-center"
          onMouseEnter={() => setShowHash(true)}
          onMouseLeave={() => setShowHash(false)}
        >
          {showHash ? (
            <p>{state.hash}</p>
          ) : (
            <p>Hosting replies from {state.lowestId}</p>
          )}
        </span>
      </header>
      <div className="flex flex-col justify-center items-center h-32 w-full px-4">
        <h1 className="text-4xl">/nc/ - NoChan</h1>
        <button
          className="py-2 px-4 rounded mt-4 hoverable text-white"
          // on hover change background color to var(--primary) and text color to var(--text)
        >
          {!threadId ? (
            <span> Start a thread</span>
          ) : (
            <span>Reply to {threadId}</span>
          )}
        </button>
      </div>
    </>
  );
}
