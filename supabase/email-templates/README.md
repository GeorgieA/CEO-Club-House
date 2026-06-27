# CI-konforme Auth-E-Mails

Diese HTML-Templates sind im CEO-Clubhouse-CI gestaltet (Ink `#190046`, Accent `#ff5a1f`, Logo, helle editoriale Optik) und für E-Mail-Clients optimiert (table-based Layout, Inline-Styles).

## Einbau im Supabase Dashboard

1. **Authentication** → **Email Templates**
2. Oben das jeweilige Template auswählen und den HTML-Inhalt der passenden Datei einfügen:

| Supabase-Template     | Datei                  |
| --------------------- | ---------------------- |
| Confirm signup        | `confirm-signup.html`  |
| Reset Password        | `reset-password.html`  |
| Magic Link            | `magic-link.html`      |
| Change Email Address  | `change-email.html`    |
| Invite user           | `invite.html`          |

3. Jeweils **Save** klicken.

## Wichtig

- **Confirm signup** nutzt den eigenen Bestätigungs-Pfad
  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
  (passend zur Route `app/auth/confirm/route.ts`). Diesen Link nicht ändern.
- Die übrigen Templates nutzen die Standard-Variable `{{ .ConfirmationURL }}`
  und funktionieren ohne weitere Routen.
- Das Logo wird absolut von `https://ceo-club-house.vercel.app/logo.png`
  geladen. Bei eigener Domain (z. B. `www.ceo-club-house.de`) die Bild-URL
  in den Templates entsprechend anpassen.

## Vorschau

Die `.html`-Dateien lassen sich direkt im Browser öffnen, um das Design zu prüfen
(die `{{ ... }}`-Platzhalter bleiben dabei als Text sichtbar).
