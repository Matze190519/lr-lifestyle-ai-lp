import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function LinaChatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Warte darauf, dass Botpress geladen ist
    const checkBotpress = setInterval(() => {
      if ((window as any).botpress) {
        clearInterval(checkBotpress);
        console.log("✓ Botpress Webchat geladen");
      }
    }, 500);

    return () => clearInterval(checkBotpress);
  }, []);

  const toggleChat = () => {
    if ((window as any).botpressWebChat) {
      if (isChatOpen) {
        (window as any).botpressWebChat.close();
      } else {
        (window as any).botpressWebChat.open();
      }
      setIsChatOpen(!isChatOpen);
    } else {
      console.error("Botpress Webchat nicht verfügbar");
    }
  };

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
