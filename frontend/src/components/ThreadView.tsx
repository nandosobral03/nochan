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
import { getBlurDataUrl } from "@/utils/utils";
export default function ThreadView({ thread }: { thread: Thread }) {
  return (
    <div className="flex flex-col w-full px-4 flex-grow">
      <span className="flex w-full gap-4 h-8" id={thread.id}>
        {thread.image && <ImageHeader image={thread.image} />}
      </span>
      <AnimatePresence initial={false}>
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
            <ThreadHeader thread={thread} threadId={thread.id} />
            <ThreadContent thread={thread} />
          </blockquote>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
