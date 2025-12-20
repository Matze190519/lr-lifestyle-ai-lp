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

Dieser Code wird im Popup verwendet, um den Santa Avatar zu laden.

---

## 2. Wissensdatenbank

Die Wissensdatenbank ist bereits im Avatar konfiguriert (Embed-ID oben).

**Datei zur Referenz:** `SANTA_WISSENSDATENBANK_HEYGEN.txt` (im Anhang)

---

## 3. Komponenten erstellen

### 3.1 LiveAvatarFAB.tsx (Floating Action Button)

Erstelle die Datei `client/src/components/LiveAvatarFAB.tsx`:

```tsx
import { useState } from "react";
import { LiveAvatarPopup } from "./LiveAvatarPopup";

export const LiveAvatarFAB = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button - Links unten */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 bottom-4 z-50 group"
        aria-label="Mit Santa sprechen"
      >
        <div className="relative">
          {/* Santa Bild */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A86C] shadow-lg transition-transform group-hover:scale-110">
            <img 
              src="/images/santa-button.jpg" 
              alt="Santa Claus"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online Indikator - WICHTIG: bottom-2 right-2 damit er nicht abgeschnitten wird */}
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-black shadow-[0_0_6px_#10b981]"></div>
        </div>
      </button>

      {/* Popup */}
      {isOpen && <LiveAvatarPopup onClose={() => setIsOpen(false)} />}
    </>
  );
};
```

### 3.2 LiveAvatarPopup.tsx (Das Popup mit dem Avatar)

Erstelle die Datei `client/src/components/LiveAvatarPopup.tsx`:

```tsx
import { X } from "lucide-react";

interface LiveAvatarPopupProps {
  onClose: () => void;
}

export const LiveAvatarPopup = ({ onClose }: LiveAvatarPopupProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-black rounded-2xl border border-[#C9A86C]/30 overflow-hidden shadow-2xl">
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
      </div>
    </div>
  );
};
```

---

## 4. Santa-Bild hinzufügen

Speichere ein Santa-Bild als `client/public/images/santa-button.jpg`

**Anforderungen:**
- Realistisches Bild (kein Cartoon)
- Dunkler Hintergrund (passt zum Design)
- Freundliches Gesicht
- Quadratisches Format empfohlen

---

## 5. In App.tsx einbinden

Füge die Komponente in `client/src/App.tsx` ein:

```tsx
import { LiveAvatarFAB } from "./components/LiveAvatarFAB";

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

## 6. Wissensdatenbank-Inhalt (Zusammenfassung)

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

## 7. Nach Weihnachten zurücksetzen

Nach Weihnachten den Avatar wieder auf Mathias umstellen:
1. Embed-ID im iframe ändern (auf Mathias Avatar)
2. Button-Bild auf Mathias ändern

---

## Wichtige Hinweise

- Der Avatar wird über einen **iframe** eingebunden
- Die Wissensdatenbank ist bereits im Avatar konfiguriert
- Der grüne Online-Punkt zeigt, dass Santa "verfügbar" ist
- Mobile-optimiert: Das Popup passt sich an kleine Bildschirme an
- **WICHTIG:** Der Online-Punkt muss `bottom-2 right-2` sein, damit er nicht abgeschnitten wird!

---

## Dateien im Anhang

1. `SANTA_WISSENSDATENBANK_HEYGEN.txt` - Wissensdatenbank (zur Referenz)
2. `santa-button.jpg` - Santa-Bild für den Button
