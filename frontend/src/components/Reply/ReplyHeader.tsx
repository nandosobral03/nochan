import { Reply } from "@/model/thread.model";
import { AnimatePresence, motion } from "framer-motion";

export default function ReplyHeader({
  reply,
  compact,
}: {
  reply: Reply;
  compact?: boolean;
}): JSX.Element {
  return (
    <div className="flex gap-2 float-left ml-2">
      <span className="font-bold text-user">{reply.author}</span>
      <AnimatePresence initial={false}>
        {!compact && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex gap-2"
          >
            <span>
              {new Date(reply.timestamp).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </span>
            <button className="hover:underline hover:text-lightAccent">
              #{reply.id}
            </button>
            <button className="hover:underline hover:text-lightAccent">
              [Reply]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
