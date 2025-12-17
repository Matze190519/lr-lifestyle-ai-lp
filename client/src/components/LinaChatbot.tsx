import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    botpress?: {
      open: () => void;
      close: () => void;
      toggle: () => void;
    };
  }
}

export default function LinaChatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Zeige den Button nach 2 Sekunden (damit Botpress Zeit zum Laden hat)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const openChat = () => {
    if (window.botpress) {
      try {
        window.botpress.open();
        setIsChatOpen(true);
        console.log("✓ Botpress Webchat geöffnet");
      } catch (error) {
        console.error("Fehler beim Öffnen des Chatbots:", error);
        window.open("https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.", "_blank");
      }
    } else {
      console.warn("Botpress nicht verfügbar - Fallback zu WhatsApp");
      window.open("https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.", "_blank");
    }
  };

  const closeChat = () => {
    if (window.botpress) {
      try {
        window.botpress.close();
        setIsChatOpen(false);
        console.log("✓ Botpress Webchat geschlossen");
      } catch (error) {
        console.error("Fehler beim Schließen des Chatbots:", error);
      }
    }
    setIsChatOpen(false);
  };

  // Zeige den Button immer (auch wenn Botpress nicht geladen ist)
  if (!showButton) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button - Gold Design */}
      <Button
        onClick={isChatOpen ? closeChat : openChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-[#C9A86C]/50"
        style={{
          background: isChatOpen 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
            : 'linear-gradient(135deg, #C9A86C 0%, #8B7355 50%, #C9A86C 100%)',
          boxShadow: isChatOpen 
            ? '0 0 20px rgba(255, 255, 255, 0.3)' 
            : '0 0 30px rgba(201, 168, 108, 0.5), 0 0 60px rgba(201, 168, 108, 0.3)'
        }}
        aria-label={isChatOpen ? "Chat mit Lina schließen" : "Chat mit Lina öffnen"}
      >
        {isChatOpen ? (
          <X className="w-6 h-6 text-[#C9A86C]" />
        ) : (
          <MessageCircle className="w-6 h-6 text-black" />
        )}
      </Button>

      {/* Badge mit "Lina" Label - Gold Design */}
      {!isChatOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce"
          style={{
            background: 'linear-gradient(135deg, #C9A86C 0%, #8B7355 50%, #C9A86C 100%)',
            boxShadow: '0 0 20px rgba(201, 168, 108, 0.4)'
          }}
        >
          💬 Chat mit Lina
        </div>
      )}
    </>
  );
}
