# Botpress Lina Chat - Allowed Origins Anleitung

## Problem
Der Lina Chat (Botpress Webchat) funktioniert nicht auf der neuen Landing Page, weil die Domain nicht in den "Allowed Origins" freigeschaltet ist.

---

## Schritt-für-Schritt Anleitung

### Schritt 1: Botpress Dashboard öffnen
1. Gehe zu: **https://app.botpress.cloud/**
2. Logge dich ein mit deinem Account (Google, GitHub, E-Mail)

---

### Schritt 2: Bot auswählen
1. Nach dem Login siehst du deine Bots/Workspaces
2. Klicke auf den **Lina Bot** (oder den Bot, den du für den Chat verwendest)

---

### Schritt 3: Webchat Einstellungen öffnen
1. In der linken Sidebar, klicke auf **"Webchat"** oder **"Integrations"**
2. Dann klicke auf **"Deploy Settings"** oder **"Configuration"**

---

### Schritt 4: Allowed Origins finden
1. Scrolle nach unten zu **"Allowed Origins"** oder **"Security Settings"**
2. Du siehst eine Liste der aktuell erlaubten Domains

---

### Schritt 5: Neue Domain hinzufügen
Füge folgende Domains zur Whitelist hinzu:

**Für die Live-Seite (nach Publish):**
```
https://lr-lifestyle-ai-lp.manus.space
```

**Für den Dev-Server (zum Testen):**
```
https://3000-itdw0yarcumqrewrykwss-2020ef04.manusvm.computer
```

**Falls du eine eigene Domain verwendest:**
```
https://deine-domain.de
```

---

### Schritt 6: Speichern
1. Klicke auf **"Save"** oder **"Update"**
2. Warte einige Sekunden, bis die Änderungen übernommen werden

---

### Schritt 7: Testen
1. Öffne die Landing Page neu (Hard Refresh: Strg+Shift+R)
2. Der "Chat mit Lina" Button sollte jetzt funktionieren

---

## Alternative: Neuen Bot erstellen

Falls du einen separaten Bot nur für diese Landing Page möchtest:

1. **Neuen Bot erstellen** in Botpress
2. **Flows kopieren** vom bestehenden Lina Bot
3. **Neue Embed-Skripte generieren** unter Webchat > Deploy
4. **Skripte ersetzen** in `client/index.html`:

```html
<!-- Aktueller Code -->
<script src="https://cdn.botpress.cloud/webchat/v3.4/inject.js"></script>
<script src="https://files.bpcontent.cloud/2025/05/06/15/20250506153427-V2JQXLMN.js" defer></script>

<!-- Ersetzen mit neuen Skripten vom neuen Bot -->
```

---

## Wichtige Hinweise

- **Wildcards:** Du kannst auch `*.manus.space` verwenden, um alle Subdomains zu erlauben
- **HTTP vs HTTPS:** Achte darauf, dass du die richtige Protokoll-Version verwendest (meistens HTTPS)
- **Cache:** Nach Änderungen kann es einige Minuten dauern, bis sie wirksam werden

---

## Support

Falls du Probleme hast:
- Botpress Discord: https://discord.gg/botpress
- Botpress Docs: https://botpress.com/docs/
