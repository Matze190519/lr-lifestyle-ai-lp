# Botpress Custom Styling Anleitung

## So lädst du das Custom CSS in Botpress hoch

### Schritt 1: CSS-Datei hosten
Die Datei `botpress-custom-style.css` muss öffentlich erreichbar sein. Du hast zwei Optionen:

**Option A: Botpress File Storage (Empfohlen)**
1. Gehe zu deinem Botpress Dashboard: https://app.botpress.cloud/
2. Öffne deinen Bot "Lina vom LR Lifestyle Team"
3. Navigiere zu **Settings** → **Files**
4. Lade die Datei `botpress-custom-style.css` hoch
5. Kopiere die generierte URL (z.B. `https://files.bpcontent.cloud/2025/...`)

**Option B: Eigenes Hosting**
- Lade die CSS-Datei auf deinen Webserver hoch
- Stelle sicher, dass die Datei öffentlich erreichbar ist
- Notiere die URL (z.B. `https://deine-domain.de/botpress-custom-style.css`)

### Schritt 2: CSS in Botpress konfigurieren
1. Gehe zu **Settings** → **Webchat**
2. Scrolle zu **Appearance** → **Advanced**
3. Finde das Feld **"Additional Stylesheet URL"**
4. Trage die URL deiner CSS-Datei ein
5. Klicke auf **Save**

### Schritt 3: Testen
1. Öffne deine Landing Page
2. Klicke auf den "Chat mit Lina"-Button
3. Der Chatbot sollte jetzt im "Futuristic Premium" Design erscheinen

## Design-Details

Das Custom CSS passt den Chatbot an das Landing Page Design an:

- **Farben**: Deep Navy (#0a0a1a), Cyan (#00d4ff), Gold (#ffd700)
- **Effekte**: Glassmorphismus, Glow-Effekte, Blur
- **Typografie**: Poppins für Headlines, Inter für Text
- **Animationen**: Subtile Glow-Animationen für Premium-Look

## Aktueller Status

**Deine aktuelle Stylesheet URL:**
```
https://files.bpcontent.cloud/2025/11/17/18/20251117183249-ODXZWBXJ.css
```

**Neue Stylesheet URL (nach Upload):**
```
[Hier die neue URL eintragen nach dem Upload]
```

## Troubleshooting

### Der Chatbot zeigt das alte Design
- **Lösung**: Leere den Browser-Cache (Strg + Shift + R)
- **Prüfung**: Öffne die CSS-URL direkt im Browser - wird sie korrekt geladen?

### CSS wird nicht geladen
- **Lösung**: Prüfe, ob die URL öffentlich erreichbar ist
- **CORS-Fehler**: Stelle sicher, dass der Server CORS-Header sendet

### Design-Anpassungen
- Öffne `botpress-custom-style.css` und passe die Farben an
- Lade die aktualisierte Datei erneut hoch
- Warte 1-2 Minuten, bis Botpress die Änderungen übernimmt

## Support

Bei Fragen zur Botpress-Konfiguration:
- Botpress Docs: https://botpress.com/docs
- Webchat Styling: https://botpress.com/docs/webchat/customization
