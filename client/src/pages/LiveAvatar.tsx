import { ArrowLeft } from 'lucide-react';

// Santa Claus Avatar - Christmas Special!
// Mathias ist gerade unterwegs und trägt die Geschenke aus
// EMBED-ID (nicht Avatar-ID!)
const EMBED_ID = 'c5d25434-47d0-49a5-b1c5-cef9e488c1da';

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

      {/* Title - Christmas Edition */}
      <div className="text-center py-3 bg-black">
        <h1 className="text-xl md:text-2xl font-bold">
          <span className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent">
            🎅 Santa Claus
          </span>
        </h1>
        <p className="text-gray-400 text-xs">Vertretung für Mathias - er trägt gerade die Geschenke aus!</p>
      </div>

      {/* HeyGen Embed - Takes full remaining height */}
      <div className="flex-1 bg-black">
        <iframe 
          src={`https://embed.liveavatar.com/v1/${EMBED_ID}`}
          allow="microphone"
          title="Santa Claus - LiveAvatar"
          className="w-full h-full"
          style={{ 
            border: 'none',
            backgroundColor: '#000',
            minHeight: 'calc(100vh - 120px)'
          }}
        />
      </div>
    </div>
  );
}
