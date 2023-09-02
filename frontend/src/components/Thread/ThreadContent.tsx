import { Thread } from "@/model/thread.model";
import { useMemo } from "react";
import { parseContent } from "@/utils/utils";
import Reply from "../Reply/Reply";

export default function ThreadContent({
  thread,
}: {
  thread: Thread;
}): JSX.Element {
  let { element, tagged } = useMemo(
    () => parseContent(thread.content),
    [thread.content]
  );
  return (
    <blockquote className="p-4 text-left">
      {element}
      {thread.replies.map((reply) => (
        <Reply key={reply.id} reply={reply} />
      ))}
    </blockquote>
  );
}
