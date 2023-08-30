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
          Everything was created after {/* Long date of 24 hours ago */}
          {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
      </header>
      <div className="flex flex-col justify-center items-center h-32 w-full px-4">
        <h1 className="text-4xl">/nc/ - NoChan</h1>
        <button className="py-2 px-4 rounded mt-4 hoverable text-white">
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
