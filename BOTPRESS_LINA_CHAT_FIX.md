# Lina Chat Problem - Botpress Lösung

## Problem
Der Botpress Webchat funktioniert nicht auf der neuen Landing Page, weil er bereits auf anderen Seiten eingebaut ist.

## Lösung: Allowed Origins konfigurieren

Laut Botpress Dokumentation musst du die **Allowed Origins** (Whitelist) in deinem Botpress Dashboard aktualisieren:

### Schritte:

1. **Botpress Dashboard öffnen**
   - Gehe zu: https://app.botpress.cloud/
   - Logge dich ein

2. **Bot auswählen**
   - Wähle den Lina Bot aus

3. **Webchat Einstellungen öffnen**
   - Gehe zu: **Webchat** > **Deploy Settings**
   - Oder: **Settings** > **Allowed Origins**

4. **Neue Domain hinzufügen**
   - Füge die neue Domain zur Whitelist hinzu:
   - `https://lr-lifestyle-ai-lp.manus.space` (oder deine finale Domain)
   - `https://3000-itdw0yarcumqrewrykwss-2020ef04.manusvm.computer` (Dev-Server)

5. **Speichern**
   - Klicke auf "Save" oder "Update"

## Wichtig

> "Allowed Origins is a feature that lets you explicitly control where your bot is allowed to run by specifying a whitelist of approved domains. When deploying your bot on a website, you include only the domains that you trust, and the system automatically blocks any attempts to embed the bot from unapproved sources."

## Alternative: Separater Bot

Falls du einen separaten Bot für diese Landing Page möchtest:
1. Erstelle einen neuen Bot in Botpress
2. Kopiere die Flows vom bestehenden Lina Bot
3. Generiere neue Embed-Skripte
4. Ersetze die Skripte in `client/index.html`

## Aktueller Embed-Code in index.html

```html
<!-- Botpress Webchat v3.4 -->
<script src="https://cdn.botpress.cloud/webchat/v3.4/inject.js"></script>
<script src="https://files.bpcontent.cloud/2025/05/06/15/20250506153427-V2JQXLMN.js" defer></script>
```

Die zweite Script-URL (`V2JQXLMN.js`) enthält die Bot-spezifische Konfiguration. Diese muss möglicherweise aktualisiert werden, wenn du einen neuen Bot erstellst.
