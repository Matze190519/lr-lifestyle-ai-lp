import { ArrowLeft } from 'lucide-react';

// HeyGen Embed ID from user
const EMBED_ID = '30ab5f04-58df-4624-955d-ee875cfe4f25';

export default function LiveAvatarPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="border-b border-[#d4af37]/20 py-3 flex-shrink-0 bg-black">
        <div className="container">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4cf67] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </a>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-black">
        <div className="container py-4 flex-1 flex flex-col">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
            
            {/* Title */}
            <div className="text-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-[#d4af37] via-[#f4cf67] to-[#d4af37] bg-clip-text text-transparent">
                  Sprich mit Mathias
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Dein persönlicher KI-Berater</p>
            </div>

            {/* HeyGen Embed - Simple iframe solution */}
            <div className="flex-1 min-h-[400px] md:min-h-[500px] rounded-xl overflow-hidden border border-[#d4af37]/20 bg-black">
              <iframe 
                src={`https://embed.liveavatar.com/v1/${EMBED_ID}`}
                allow="microphone"
                title="LiveAvatar Embed"
                className="w-full h-full"
                style={{ 
                  aspectRatio: '16/9',
                  minHeight: '400px',
                  border: 'none',
                  backgroundColor: '#000'
                }}
              />
            </div>

            {/* Info */}
            <p className="text-center text-gray-500 text-xs mt-4">
              Klicke auf den Avatar um das Gespräch zu starten. Mikrofon-Zugriff wird benötigt.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
