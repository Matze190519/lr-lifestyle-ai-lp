import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      {/* Floating Action Button - positioned on LEFT side (away from Lina chat) */}
      <div className="fixed bottom-6 md:bottom-8 left-4 md:left-8 z-50">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-[#0a0a0a] border border-red-500/30 rounded-lg px-4 py-2 shadow-lg">
                <p className="text-white text-sm font-medium">🎅 Sprich mit Santa!</p>
                <p className="text-red-400/70 text-xs">Live Video-Chat</p>
              </div>
              {/* Arrow pointing left */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                <div className="border-8 border-transparent border-r-red-500/30"></div>
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
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-lg shadow-red-500/30 flex items-center justify-center group border-2 border-red-500/50"
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></span>
          
          {/* Real Santa Image */}
          <img 
            src="/images/santa-button.jpg" 
            alt="Santa Claus" 
            className="w-full h-full object-cover relative z-10"
          />
          
          {/* Online indicator */}
          <span className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-[#10b981] rounded-full border-2 border-[#0a0a0a] z-20"></span>
        </motion.button>
      </div>

      {/* Popup */}
      <LiveAvatarPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
