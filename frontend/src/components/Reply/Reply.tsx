import { getBlurDataUrl, parseContent } from "@/utils/utils";
import { useMemo, useState } from "react";
import { Reply } from "@/model/thread.model";
import ImageHeader from "../Thread/ImageHeader";
import ImageSwitcher from "../CompressedImage";
import ReplyHeader from "./ReplyHeader";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

export default function Reply({ reply }: { reply: Reply }): JSX.Element {
  let { element } = useMemo(() => parseContent(reply.content), [reply.content]);
  const [expanded, setExpanded] = useState(true);
  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex items-start justify-start p-1">
      <motion.div animate={{ rotate: expanded ? 0 : 180 }} layout className="">
        <button onClick={handleExpand} className="p-2">
          <ChevronDownIcon />
        </button>
      </motion.div>
      <div className="flex flex-col items-start justify-start w-full bg-primaryLight p-2 rounded">
        <ReplyHeader reply={reply} compact={!expanded} />
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
              {reply.image && <ImageHeader image={reply.image} />}
              <blockquote className="items-start justify-start w-full">
                {reply.image && (
                  <ImageSwitcher
                    fullUrl={reply.image.url}
                    compressedUrl={getBlurDataUrl(reply.image.url)}
                    className="max-w-xxs max-h-32 float-left mx-5 my-1"
                  />
                )}
                {element}
              </blockquote>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
