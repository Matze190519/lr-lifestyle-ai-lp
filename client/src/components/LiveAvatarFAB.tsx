import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from 'lucide-react';
import LiveAvatarPopup from './LiveAvatarPopup';

export default function LiveAvatarFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating Action Button - positioned ABOVE Lina chat button */}
      <div className="fixed bottom-36 md:bottom-28 right-4 md:right-8 z-50">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-[#0a0a0a] border border-[#C9A86C]/30 rounded-lg px-4 py-2 shadow-lg">
                <p className="text-white text-sm font-medium">Sprich mit Mathias!</p>
                <p className="text-[#C9A86C]/70 text-xs">Live Video-Chat</p>
              </div>
              {/* Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                <div className="border-8 border-transparent border-l-[#C9A86C]/30"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            console.log('FAB clicked, opening popup');
            setIsOpen(true);
            setShowTooltip(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#C9A86C] to-[#8B7355] text-black shadow-lg shadow-[#C9A86C]/30 flex items-center justify-center group"
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-[#C9A86C] animate-ping opacity-30"></span>
          
          {/* Icon */}
          <Video className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
          
          {/* Online indicator */}
          <span className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-[#10b981] rounded-full border-2 border-[#0a0a0a]"></span>
        </motion.button>
      </div>

      {/* Popup */}
      <LiveAvatarPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
