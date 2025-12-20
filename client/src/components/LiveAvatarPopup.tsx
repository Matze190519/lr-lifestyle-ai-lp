import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Santa Claus Avatar - Christmas Special!
// Mathias ist gerade unterwegs und trägt die Geschenke aus
// EMBED-ID (nicht Avatar-ID!)
const EMBED_ID = 'c5d25434-47d0-49a5-b1c5-cef9e488c1da';

interface LiveAvatarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveAvatarPopup({ isOpen, onClose }: LiveAvatarPopupProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Popup - Positioned on LEFT side to avoid Lina chat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            className="fixed z-[101] bg-black rounded-2xl border border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.15)] overflow-hidden flex flex-col
                       bottom-4 left-4 md:bottom-8 md:left-8"
            style={{
              width: 'min(90vw, 450px)',
              height: 'min(70vh, 500px)',
              maxWidth: 'calc(100vw - 32px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Christmas Style */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-red-500/20 bg-[#0d0d0d] flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-500/30">
                  <img src="/images/santa-button.jpg" alt="Santa" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Santa Claus</h3>
                  <p className="text-red-400/60 text-xs">Vertretung für Mathias 🎄</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* HeyGen Embed - Santa Claus */}
            <div className="flex-1 bg-black">
              <iframe 
                src={`https://embed.liveavatar.com/v1/${EMBED_ID}`}
                allow="microphone"
                title="Santa Claus - LiveAvatar"
                className="w-full h-full"
                style={{ 
                  border: 'none',
                  backgroundColor: '#000'
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
