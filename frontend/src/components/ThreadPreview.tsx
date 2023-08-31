import { Thread } from "@/model/thread.model";
import ImageHeader from "./Thread/ImageHeader";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

import { useState } from "react";
import Image from "next/image";
import CompressedImage from "./CompressedImage";
import ImageSwitcher from "./CompressedImage";
import ThreadHeader from "./Thread/ThreadHeader";
import ThreadContent from "./Thread/ThreadContent";
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
      <span className="flex w-full gap-4 h-8" id={thread.id}>
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
            <blockquote className="text-left">
              {thread.image && (
                <ImageSwitcher
                  fullUrl={thread.image.url}
                  compressedUrl={getBlurDataUrl(thread.image.url)}
                  className="max-w-xs max-h-96 float-left mx-5 my-1"
                />
              )}
              <ThreadHeader thread={thread} />
              <ThreadContent thread={thread} />
            </blockquote>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
