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

  const toggleChat = () => {
    if (window.botpress) {
      try {
        window.botpress.toggle();
        setIsChatOpen(prev => !prev);
        console.log("✓ Botpress Webchat geöffnet");
      } catch (error) {
        console.error("Fehler beim Öffnen des Chatbots:", error);
        // Fallback: Öffne WhatsApp
        window.open("https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.", "_blank");
      }
    } else {
      console.warn("Botpress nicht verfügbar - Fallback zu WhatsApp");
      window.open("https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.", "_blank");
    }
  };

  // Zeige den Button immer (auch wenn Botpress nicht geladen ist)
  if (!showButton) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:scale-110"
        aria-label="Chat mit Lina öffnen"
      >
        {isChatOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Optional: Badge mit "Lina" Label */}
      {!isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
          💬 Chat mit Lina
        </div>
      )}
    </>
  );
}
