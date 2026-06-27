# Supabase Auth — Dashboard-Einstellungen

Diese Schritte im Supabase Dashboard ausführen (kein Docker nötig).

## 1. SQL ausführen

Im **SQL Editor** den Inhalt von `supabase/auth-schema.sql` einfügen und ausführen.

## 2. E-Mail-Bestätigung aktivieren

1. **Authentication** → **Providers** → **Email**
2. **Confirm email** aktivieren (Häkchen setzen)
3. Speichern

## 3. URL-Konfiguration

1. **Authentication** → **URL Configuration**
2. **Site URL:** `https://ceo-club-house.vercel.app`
3. **Redirect URLs** hinzufügen:
   - `https://ceo-club-house.vercel.app/auth/confirm`
   - `http://localhost:3000/auth/confirm`
4. Speichern

## 4. E-Mail-Template anpassen

1. **Authentication** → **Email Templates** → **Confirm signup**
2. Im Template den Bestätigungslink ersetzen durch:

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

3. Speichern

> Tipp: Statt nur den Link zu ändern, kannst du das komplette CI-gestylte
> Template aus `supabase/email-templates/confirm-signup.html` einfügen.
> Anleitung für alle Templates: `supabase/email-templates/README.md`.

## 5. Test

1. Registrierung unter `/signup` testen
2. Bestätigungsmail öffnen → Klick → Redirect auf Startseite
3. Login unter `/login` testen
