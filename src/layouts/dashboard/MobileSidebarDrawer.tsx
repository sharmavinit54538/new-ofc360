import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";

export function MobileSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: -270 }} animate={{ x: 0 }} exit={{ x: -270 }}
            transition={{ type: "tween", duration: 0.22 }} className="fixed left-0 top-0 z-50 h-full"
          >
            <AppSidebar open={true} onToggle={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
