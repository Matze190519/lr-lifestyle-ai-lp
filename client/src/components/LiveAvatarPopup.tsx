import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// HeyGen Embed ID from user
const EMBED_ID = '30ab5f04-58df-4624-955d-ee875cfe4f25';

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
            className="fixed z-[101] bg-black rounded-2xl border border-[#C9A86C]/30 shadow-[0_0_60px_rgba(201,168,108,0.15)] overflow-hidden flex flex-col"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(95vw, 700px)',
              height: 'min(85vh, 600px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A86C]/20 bg-[#0d0d0d] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C9A86C]/30 bg-[#1a1a1a]">
                  <img 
                    src="/images/mathias.png" 
                    alt="Mathias" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Mathias – Live Avatar</h3>
                  <p className="text-[#C9A86C]/60 text-xs">Klicke zum Starten</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* HeyGen Embed - Simple iframe solution */}
            <div className="flex-1 bg-black">
              <iframe 
                src={`https://embed.liveavatar.com/v1/${EMBED_ID}`}
                allow="microphone"
                title="LiveAvatar Embed"
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
