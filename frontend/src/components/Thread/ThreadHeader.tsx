import { Thread } from "@/model/thread.model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThreadHeader({ thread }: { thread: Thread }) {
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
  }, []);

  return (
    <div className="flex gap-2 float-left ml-2 ">
      <span className="font-bold text-darkAccent">{thread.title}</span>
      <span className="font-bold text-user">{thread.author}</span>
      <span
        title={`Thread will be deleted in ${timeLeft || "less than a minute"}`}
      >
        {new Date(thread.timestamp).toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </span>
      <Link
        className="hover:underline hover:text-lightAccent"
        href={`/thread/${thread.id}`}
      >
        #{thread.id}
      </Link>
      <button className="hover:underline hover:text-lightAccent">
        [Reply]
      </button>
    </div>
  );
}
