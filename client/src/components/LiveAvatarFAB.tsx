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
      {/* Custom styles for intense glow animation */}
      <style>{`
        @keyframes intensePulse {
          0%, 100% {
            box-shadow: 
              0 0 20px 8px rgba(255, 255, 255, 0.9),
              0 0 40px 15px rgba(212, 175, 55, 0.7),
              0 0 60px 25px rgba(255, 215, 0, 0.5),
              0 0 80px 35px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 
              0 0 30px 12px rgba(255, 255, 255, 1),
              0 0 50px 20px rgba(212, 175, 55, 0.8),
              0 0 80px 35px rgba(255, 215, 0, 0.6),
              0 0 100px 50px rgba(255, 255, 255, 0.4);
          }
        }
        
        @keyframes starFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(80px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes starOrbit {
          0% {
            transform: rotate(0deg) translateX(45px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(45px) rotate(-360deg);
          }
        }
        
        .santa-glow {
          animation: intensePulse 2s ease-in-out infinite;
        }
        
        .star-float {
          animation: starFloat 3s ease-in-out infinite;
        }
        
        .star-orbit {
          animation: starOrbit 4s linear infinite;
        }
      `}</style>

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
              <div className="bg-[#0a0a0a] border border-[#D4AF37]/50 rounded-lg px-4 py-2 shadow-lg shadow-[#D4AF37]/20">
                <p className="text-[#D4AF37] text-sm font-medium">🎅 Sprich mit Santa!</p>
                <p className="text-[#D4AF37]/70 text-xs">Live Video-Chat</p>
              </div>
              {/* Arrow pointing left */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                <div className="border-8 border-transparent border-r-[#D4AF37]/50"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button wrapper - relative for positioning the indicator */}
        <div className="relative">
          {/* Golden Stars orbiting around the button */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FFD700] text-lg pointer-events-none star-orbit"
              style={{
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              ✦
            </span>
          ))}
          
          <motion.button
            onClick={() => {
              console.log('FAB clicked, opening popup');
              setIsOpen(true);
              setShowTooltip(false);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center group border-3 border-[#D4AF37] santa-glow"
          >
            {/* Real Santa Image */}
            <img 
              src="/images/santa-button.jpg" 
              alt="Santa Claus" 
              className="w-full h-full object-cover relative z-10"
            />
          </motion.button>
          
          {/* Online indicator - OUTSIDE the button so it's not clipped */}
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 bg-[#10b981] rounded-full border-2 border-[#0a0a0a] z-30 shadow-[0_0_10px_#10b981,0_0_20px_#10b981]"></span>
        </div>
      </div>

      {/* Popup */}
      <LiveAvatarPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
