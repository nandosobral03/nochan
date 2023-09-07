import { Thread } from "@/model/thread.model";
import { useModalStore } from "@/utils/store";
import { useEffect, useState } from "react";
import CreateReplyModal from "../Modals/CreateReplyModal";

export default function ThreadHeader({
  thread,
  threadId,
}: {
  thread: Thread;
  threadId?: string;
}) {
  const { setModal } = useModalStore();
  const getTimeLeft = (timestamp: number) => {
    // 24 hours from timestamp
    const timeLeft = timestamp + 24 * 60 * 60 * 1000 - Date.now();
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft / (60 * 1000)) % 60);
    return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""}`;
  };
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(thread.timestamp));
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(thread.timestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [thread.timestamp]);

  return (
    <div className="flex gap-2  ml-2 flex-wrap">
      <span className="font-bold text-darkAccent">{thread.title}</span>
      <span className="font-bold text-user">{thread.author}</span>
      <span
        title={`Thread will be deleted in ${timeLeft || "less than a minute"}`}
        className="md:whitespace-nowrap"
      >
        {new Date(thread.timestamp).toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </span>
      {threadId ? (
        <button
          className="hover:underline hover:text-lightAccent"
          onClick={() => {
            document.dispatchEvent(
              new CustomEvent("idClicked", {
                detail: { threadId, id: thread.id },
              })
            );
          }}
        >
          #{threadId}
        </button>
      ) : (
        <a
          className="hover:underline hover:text-lightAccent"
          href={`/thread/${thread.id}`}
        >
          #{thread.id}
        </a>
      )}
      <button
        className="hover:underline hover:text-lightAccent"
        onClick={() => {
          setModal(<CreateReplyModal threadId={thread.id} />);
        }}
      >
        [Reply]
      </button>
      {thread.taggedByElementIds.map((tag) => (
        <a
          className="hover:underline hover:text-lightAccent"
          href={`/thread/${tag}`}
        >
          {`>>${tag.padStart(8, "0")}`}
        </a>
      ))}
    </div>
  );
}
