import { Reply } from "@/model/thread.model";
import { useModalStore } from "@/utils/store";
import { AnimatePresence, motion } from "framer-motion";
import CreateReplyModal from "../Modals/CreateReplyModal";

export default function ReplyHeader({
  reply,
  compact,
  threadId,
}: {
  reply: Reply;
  threadId: string;
  compact?: boolean;
}): JSX.Element {
  return (
    <div className="flex gap-2 float-left ml-2 flex-wrap">
      <span className="font-bold text-user">{reply.author}</span>
      <AnimatePresence initial={false}>
        {/* Dont allow word wrap */}
        <span className="whitespace-nowrap">
          {new Date(reply.timestamp).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
        <button
          className="hover:underline hover:text-lightAccent"
          onClick={() => {
            document.dispatchEvent(
              new CustomEvent("idClicked", {
                detail: { id: reply.id, threadId },
              })
            );
          }}
        >
          #{reply.id}
        </button>
        {reply.taggedByElementIds.map((tag) => (
          <a
            className="hover:underline hover:text-lightAccent"
            href={`/thread/${tag}`}
            key={tag}
          >
            {`>>${tag.padStart(8, "0")}`}
          </a>
        ))}
      </AnimatePresence>
    </div>
  );
}
