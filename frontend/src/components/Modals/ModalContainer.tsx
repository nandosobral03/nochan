import { useModalStore } from "@/utils/store";
import { motion, useDragControls } from "framer-motion";
import { useRef } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
export default function ModalContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dragControls = useDragControls();
  const { clearModal } = useModalStore();
  const constraintsRef = useRef(null);
  return (
    <motion.div
      className="fixed z-10 flex justify-center items-center w-full h-full pointer-events-none"
      ref={constraintsRef}
    >
      <motion.div
        className="w-96 h-172 bg-primary rounded-lg shadow-lg flex flex-col pointer-events-auto"
        drag
        dragConstraints={constraintsRef}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0}
      >
        <div
          className="bg-primaryLight w-full p-2 flex justify-end  cursor-move"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <button onClick={clearModal}>
            <Cross2Icon />
          </button>
        </div>
        <div>{children}</div>
      </motion.div>
    </motion.div>
  );
}
