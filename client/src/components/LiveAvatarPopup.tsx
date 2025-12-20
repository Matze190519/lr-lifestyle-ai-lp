import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Santa Claus Avatar - Christmas Special!
// Mathias ist gerade unterwegs und trägt die Geschenke aus
const EMBED_ID = '1c690fe7-23e0-49f9-bfba-14344450285b';

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
          
          {/* Popup - Responsive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed z-[101] bg-black rounded-2xl border border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.15)] overflow-hidden flex flex-col"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(95vw, 700px)',
              height: 'min(85vh, 600px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Christmas Style */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-red-500/20 bg-[#0d0d0d] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500/30 bg-[#1a1a1a] flex items-center justify-center text-2xl">
                  🎅
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Santa Claus – Live Avatar</h3>
                  <p className="text-red-400/60 text-xs">Vertretung für Mathias 🎄</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
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
