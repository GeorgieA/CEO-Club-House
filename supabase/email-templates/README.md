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

- **Confirm signup** nutzt den eigenen Bestätigungs-Pfad mit **fest
  eingetragener** CEO-Domain:
  `https://ceo-club-house.vercel.app/auth/confirm?token_hash={{ .TokenHash }}&type=email`
  (passend zur Route `app/auth/confirm/route.ts`). Die Domain ist bewusst
  hartkodiert (statt `{{ .SiteURL }}`), damit der Bestätigungslink auch dann zu
  CEO Clubhouse führt, wenn das Supabase-Projekt mit einer anderen App geteilt
  wird oder die Site URL auf eine andere App zeigt. Bei eigener Domain hier die
  URL anpassen.
- Die übrigen Templates nutzen die Standard-Variable `{{ .ConfirmationURL }}`.
  Diese wird von Supabase aus der **Site URL** des Projekts erzeugt — zeigt die
  Site URL auf die falsche App, landen Passwort-Reset/Magic-Link/Invite/E-Mail-
  Änderung ebenfalls dort. Deshalb in **Authentication → URL Configuration** die
  Site URL auf `https://ceo-club-house.vercel.app` setzen (siehe unten).

## Site URL korrekt setzen (wichtig!)

Damit alle Auth-Links in der richtigen App landen:

1. Supabase-Dashboard → **Authentication → URL Configuration**
2. **Site URL**: `https://ceo-club-house.vercel.app`
3. **Redirect URLs**: `https://ceo-club-house.vercel.app/**` und
   `http://localhost:3000/**`
4. **Save**

Hinweis: Die Site URL gilt **pro Supabase-Projekt**. Wenn CEO Clubhouse und eine
andere App (z. B. Finity CRM) dasselbe Projekt nutzen, kann es nur eine Site URL
geben — dann braucht jede App ein eigenes Supabase-Projekt.
- Das Logo wird absolut von `https://ceo-club-house.vercel.app/logo.png`
  geladen. Bei eigener Domain (z. B. `www.ceo-club-house.de`) die Bild-URL
  in den Templates entsprechend anpassen.

## Vorschau

Die `.html`-Dateien lassen sich direkt im Browser öffnen, um das Design zu prüfen
(die `{{ ... }}`-Platzhalter bleiben dabei als Text sichtbar).
