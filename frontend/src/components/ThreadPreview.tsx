import { Thread } from "@/model/thread.model";
import ImageHeader from "./Thread/ImageHeader";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

import { useState } from "react";
import Image from "next/image";
import CompressedImage from "./CompressedImage";
import ImageSwitcher from "./CompressedImage";
export default function ThreadPreview({ thread }: { thread: Thread }) {
  const [expanded, setExpanded] = useState(true);
  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const getBlurDataUrl = (url: string) => {
    let lastDot = url.lastIndexOf(".");
    // insert "-compressed" before the file extension
    console.log("blur data url", url.slice(0, lastDot) + "-compressed.png");
    return url.slice(0, lastDot) + "-compressed.png";
  };

  return (
    <div className="flex flex-col justify-center items-center w-full px-4">
      <span className="flex w-full gap-4 h-8">
        <motion.div
          animate={{ rotate: expanded ? 0 : 180 }}
          layout
          className=""
        >
          <button onClick={handleExpand} className="p-2">
            <ChevronDownIcon />
          </button>
        </motion.div>

        {thread.image && <ImageHeader image={thread.image} />}
      </span>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="block w-full"
          >
            {thread.image && (
              <ImageSwitcher
                fullUrl={thread.image.url}
                compressedUrl={getBlurDataUrl(thread.image.url)}
                className="max-w-xs max-h-96"
              />
            )}
            <div className="flex gap-2 float-left">
              <span>{thread.title}</span>
              <span>{thread.author}</span>
              <span>
                {new Date(thread.timestamp).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </span>
              <span>#{thread.id}</span>
              <button> Reply </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}