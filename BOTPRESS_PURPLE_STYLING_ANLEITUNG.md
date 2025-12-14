# Botpress Purple Gradient Styling - Anleitung

## ✅ CSS ist bereits hochgeladen!

Die CSS-Datei ist bereits auf einem öffentlichen CDN verfügbar. Du musst sie **nicht** mehr manuell hochladen.

### 📋 Deine CSS-URL (kopiere diese):
```
https://files.manuscdn.com/user_upload_by_module/session_file/310419663029098351/dlqZarRvyyAhdVbu.css
```

---

## 🚀 So aktivierst du das Purple Design in Botpress

### Schritt 1: Botpress Dashboard öffnen
1. Gehe zu: https://app.botpress.cloud/
2. Melde dich an
3. Öffne deinen Bot **"Lina vom LR Lifestyle Team"**
   - Client ID: `32dfe644-9e09-4072-bd72-34340d56cb7b`

### Schritt 2: Webchat-Einstellungen öffnen
1. Klicke in der linken Sidebar auf **"Integrations"** oder **"Channels"**
2. Wähle **"Webchat"** aus
3. Klicke auf **"Configure"** oder **"Settings"**

### Schritt 3: CSS-URL eintragen
1. Scrolle zu **"Appearance"** oder **"Styling"**
2. Finde das Feld **"Additional Stylesheet URL"** oder **"Custom CSS URL"**
3. **Lösche** die alte URL:
   ```
   https://files.bpcontent.cloud/2025/11/17/18/20251117183249-ODXZWBXJ.css
   ```
4. **Trage** die neue URL ein:
   ```
   https://files.manuscdn.com/user_upload_by_module/session_file/310419663029098351/dlqZarRvyyAhdVbu.css
   ```
5. Klicke auf **"Save"** oder **"Update"**

### Schritt 4: Testen
1. Warte 1-2 Minuten (Botpress braucht Zeit zum Aktualisieren)
2. Öffne deine Landing Page: https://3000-itdw0yarcumqrewrykwss-2020ef04.manusvm.computer
3. Klicke auf den **"Chat mit Lina"**-Button
4. Der Chatbot sollte jetzt im **Purple Gradient Design** erscheinen! 🎉

---

## 🎨 Design-Details

Das neue Purple Gradient Design enthält:

### Header
- **Gradient**: #9333EA → #7C3AED → #6366F1 (Purple Gradient)
- **Text**: Weiß (#FFFFFF)

### Bot Messages
- **Gradient**: #9333EA → #7C3AED (Purple Gradient)
- **Text**: Weiß (#FFFFFF)

### User Messages
- **Solid**: #9333EA (Purple)
- **Text**: Weiß (#FFFFFF)

### Send Button
- **Gradient**: #9333EA → #7C3AED (Purple Gradient)
- **Hover**: #A855F7 → #8B5CF6 (Lighter Purple)

### Background & Input
- **Chat Background**: #FFFFFF (Weiß)
- **Input Field**: #F8F9FA (Hellgrau)
- **Input Text**: #1F2937 (Dunkelgrau)

---

## 🔧 Troubleshooting

### Problem: Der Chatbot zeigt noch das alte Design
**Lösung 1**: Leere den Browser-Cache
- Windows/Linux: `Strg + Shift + R`
- Mac: `Cmd + Shift + R`

**Lösung 2**: Warte 2-3 Minuten
- Botpress braucht Zeit, um die neue CSS-Datei zu laden

**Lösung 3**: Prüfe die URL im Botpress-Dashboard
- Stelle sicher, dass die neue URL korrekt eingetragen ist
- Keine Leerzeichen vor oder nach der URL

### Problem: CSS wird nicht geladen (CORS-Fehler)
**Lösung**: Die URL ist bereits CORS-fähig (manuscdn.com)
- Falls es dennoch nicht funktioniert, öffne die URL direkt im Browser:
  https://files.manuscdn.com/user_upload_by_module/session_file/310419663029098351/dlqZarRvyyAhdVbu.css
- Wenn die CSS-Datei angezeigt wird, ist alles in Ordnung

### Problem: Ich möchte die Farben anpassen
**Lösung**: 
1. Öffne die Datei `botpress-custom-style-purple.css` im Projekt
2. Ändere die Hex-Farben (z.B. `#9333EA` zu einer anderen Farbe)
3. Speichere die Datei
4. Lade sie erneut mit `manus-upload-file botpress-custom-style-purple.css` hoch
5. Trage die neue URL im Botpress-Dashboard ein

---

## 📞 Support

Bei Fragen zur Botpress-Konfiguration:
- **Botpress Docs**: https://botpress.com/docs
- **Webchat Styling**: https://botpress.com/docs/webchat/customization
- **Botpress Support**: https://botpress.com/support

---

## ✨ Fertig!

Sobald du die CSS-URL im Botpress-Dashboard eingetragen hast, ist dein Chatbot im **Purple Gradient Design** live! 🎉
