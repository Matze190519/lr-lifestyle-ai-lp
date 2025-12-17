# Botpress Webchat - Manuelle Initialisierung (FAKTEN)

## Quelle
Botpress Dokumentation: https://botpress.com/docs/webchat/get-started/embedding-webchat

## Problem
- Allowed Origins ist gesperrt (erfordert 500€ Tarif-Upgrade)
- Aktueller Code funktioniert nicht auf neuer Domain

## Lösung: Manuelle Initialisierung

### Schritt 1: Script URL öffnen

Öffne die aktuelle Script-URL im Browser:
```
https://files.bpcontent.cloud/2025/05/06/15/20250506153427-V2JQXLMN.js
```

### Schritt 2: Konfiguration kopieren

Der Inhalt der Datei zeigt die `window.botpress.init()` Konfiguration:

```javascript
window.botpress.init({
    "botId": "xxxxxxxxxxxxxxxxxxxxxx",
    "configuration": {
        "website": {},
        "email": {},
        "phone": {},
        "termsOfService": {},
        "privacyPolicy": {},
        "variant": "soft",
        "themeMode": "light",
        "fontFamily": "inter"
    },
    "clientId": "xxxxxxxxxxxxxxxxxxxxxx"
});
```

### Schritt 3: Code in HTML einbauen

Ersetze den aktuellen Code in `client/index.html`:

**AKTUELL (funktioniert nicht):**
```html
<!-- Botpress Webchat v3.4 -->
<script src="https://cdn.botpress.cloud/webchat/v3.4/inject.js"></script>
<script src="https://files.bpcontent.cloud/2025/05/06/15/20250506153427-V2JQXLMN.js" defer></script>
```

**NEU (manuelle Initialisierung):**
```html
<!-- Botpress Webchat v3.4 - Manual Init -->
<script src="https://cdn.botpress.cloud/webchat/v3.4/inject.js"></script>
<script>
  window.addEventListener('load', function() {
    window.botpress.init({
      "botId": "DEINE_BOT_ID_HIER",
      "configuration": {
        "website": {},
        "email": {},
        "phone": {},
        "termsOfService": {},
        "privacyPolicy": {},
        "variant": "soft",
        "themeMode": "light",
        "fontFamily": "inter"
      },
      "clientId": "DEINE_CLIENT_ID_HIER"
    });
  });
</script>
```

## Wichtig

1. **Öffne die Script-URL** (https://files.bpcontent.cloud/2025/05/06/15/20250506153427-V2JQXLMN.js) im Browser
2. **Kopiere die echten Werte** für `botId` und `clientId`
3. **Ersetze** die Platzhalter im Code oben

## Vorteil

- Keine Allowed Origins Whitelist nötig
- Funktioniert auf allen Domains
- Kein Tarif-Upgrade erforderlich
