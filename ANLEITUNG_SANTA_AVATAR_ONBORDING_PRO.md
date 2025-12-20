# Anleitung: Santa Avatar auf onbording.pro einbauen

## Übersicht
Diese Anleitung erklärt, wie du den Santa Claus Avatar auf der Webseite onbording.pro einbaust.

---

## 1. LiveAvatar Embed-Code

**Embed-ID:** `8717c24d-56ba-4a86-a83d-ffe4649cccab`

**Vollständiger Embed-Code:**
```html
<iframe 
  src="https://embed.liveavatar.com/v1/8717c24d-56ba-4a86-a83d-ffe4649cccab" 
  allow="microphone" 
  title="LiveAvatar Embed" 
  style="aspect-ratio: 16/9; width: 100%; border: none;"
></iframe>
```

---

## 2. Wissensdatenbank

Die Wissensdatenbank ist bereits im Avatar konfiguriert.

**Datei zur Referenz:** `SANTA_WISSENSDATENBANK_HEYGEN.txt` (im Anhang)

---

## 3. Komponenten erstellen

### 3.1 LiveAvatarFAB.tsx (Floating Action Button)

Erstelle die Datei `client/src/components/LiveAvatarFAB.tsx`:

```tsx
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
      {/* Floating Action Button - positioned on LEFT side */}
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

        {/* Button wrapper - relative for positioning the indicator */}
        <div className="relative">
          <motion.button
            onClick={() => {
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
          </motion.button>
          
          {/* Online indicator - OUTSIDE the button so it's not clipped */}
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 bg-[#10b981] rounded-full border-2 border-[#0a0a0a] z-30 shadow-[0_0_8px_#10b981]"></span>
        </div>
      </div>

      {/* Popup */}
      <LiveAvatarPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

**WICHTIG:** Der Online-Punkt muss AUSSERHALB des Buttons sein (im wrapper-div), sonst wird er durch `overflow-hidden` abgeschnitten!

### 3.2 LiveAvatarPopup.tsx (Das Popup mit dem Avatar)

Erstelle die Datei `client/src/components/LiveAvatarPopup.tsx`:

```tsx
import { X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface LiveAvatarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveAvatarPopup({ isOpen, onClose }: LiveAvatarPopupProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#0a0a0a] rounded-2xl border border-[#C9A86C]/30 overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#C9A86C]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C9A86C]/50">
                <img 
                  src="/images/santa-button.jpg" 
                  alt="Santa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-white">Santa Claus</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online - Vertretung für Mathias
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Avatar Container - IFRAME */}
          <div className="w-full aspect-video bg-gradient-to-b from-black to-gray-900">
            <iframe 
              src="https://embed.liveavatar.com/v1/8717c24d-56ba-4a86-a83d-ffe4649cccab" 
              allow="microphone" 
              title="Santa Avatar"
              className="w-full h-full border-none"
            />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#C9A86C]/20 text-center">
            <p className="text-xs text-white/60">
              🎄 Ho ho ho! Frag mich alles zum Onboarding!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## 4. Santa-Bild hinzufügen

Speichere das Santa-Bild als `client/public/images/santa-button.jpg`

Das Bild ist im Anhang enthalten.

---

## 5. In App.tsx einbinden

Füge die Komponente in `client/src/App.tsx` ein:

```tsx
import LiveAvatarFAB from "./components/LiveAvatarFAB";

// Im return Statement, außerhalb des Route-Wrappers:
function App() {
  return (
    <>
      {/* Deine bestehenden Routes */}
      <Routes>
        ...
      </Routes>
      
      {/* Santa Avatar Button - immer sichtbar */}
      <LiveAvatarFAB />
    </>
  );
}
```

---

## 6. Abhängigkeiten

Falls noch nicht installiert:
```bash
pnpm add framer-motion lucide-react
```

---

## 7. Wissensdatenbank-Inhalt (Zusammenfassung)

Die Wissensdatenbank für onbording.pro enthält:

- **Persona:** Santa Claus als Vertretung für Mathias
- **Startsatz:** "Ho ho ho! Willkommen im LR Lifestyle Team! Ich bin Santa Claus..."
- **10 Onboarding-Schritte:**
  1. Lina aktivieren
  2. Lina-Onboarding durchgehen
  3. LR Neo & MyOffice einrichten
  4. Gruppen beitreten
  5. Starterpaket bestellen
  6. Shop aktivieren
  7. Produkte testen
  8. Namensliste erstellen
  9. Erste Gespräche führen
  10. Team-Calls besuchen
- **WhatsApp/Telegram Gruppen-Links**
- **Lina-Funktionen** (15 Funktionen)
- **Produkte, Karriere, Autokonzept**
- **FAQs und Einwandbehandlung**

---

## 8. Nach Weihnachten zurücksetzen

Nach Weihnachten den Avatar wieder auf Mathias umstellen:
1. Embed-ID im iframe ändern (auf Mathias Avatar)
2. Button-Bild auf Mathias ändern
3. Texte anpassen ("Sprich mit Mathias" statt "Sprich mit Santa")

---

## Wichtige Hinweise

- Der Avatar wird über einen **iframe** eingebunden
- Die Wissensdatenbank ist bereits im Avatar konfiguriert
- Der grüne Online-Punkt muss **AUSSERHALB** des Buttons sein (im wrapper-div), sonst wird er durch `overflow-hidden` abgeschnitten!
- Mobile-optimiert: Das Popup passt sich an kleine Bildschirme an

---

## Dateien im Anhang

1. `SANTA_WISSENSDATENBANK_HEYGEN.txt` - Wissensdatenbank (zur Referenz)
2. `santa-button.jpg` - Santa-Bild für den Button
