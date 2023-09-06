import { Thread, ThreadPreviewModel } from "@/model/thread.model";
import ImageHeader from "./Thread/ImageHeader";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

import { useState } from "react";
import CompressedImage from "./ImageSwitcher";
import ImageSwitcher from "./ImageSwitcher";
import ThreadHeader from "./Thread/ThreadHeader";
import ThreadContent from "./Thread/ThreadContent";
import { getBlurDataUrl } from "@/utils/utils";
export default function ThreadPreview({
  thread,
}: {
  thread: ThreadPreviewModel;
}) {
  const [expanded, setExpanded] = useState(true);
  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col w-full px-4 flex-grow ">
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
            className="flex w-full"
          >
            <blockquote className="text-left w-full">
              {thread.image && (
                <ImageSwitcher
                  fullUrl={thread.image.url}
                  compressedUrl={getBlurDataUrl(thread.image.url)}
                  className="max-w-xxs  md:max-w-xs  max-h-96 float-left mx-5 my-"
                />
              )}
              <ThreadHeader thread={thread} />
              <ThreadContent thread={thread} />
              {thread.replyCount > 4 && (
                <a
                  className="flex w-full gap-4 h-8 ml-10 text-sm text-gray-500 hover:underline hover:text-lightAccent p-0"
                  href={`/thread/${thread.id}`}
                >
                  +{thread.replyCount - 4} replies are omitted. Click to view
                </a>
              )}
            </blockquote>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
