# SEO - Manuelle Schritte

Diese Datei enthält alle Schritte, die manuell durchgeführt werden müssen, um die SEO-Optimierung abzuschließen.

## 🎨 Bilder erstellen

Die folgenden Platzhalter-Dateien müssen durch echte Bilder ersetzt werden:

### 1. Open Graph Image
- **Datei**: `/public/og-image.jpg`
- **Größe**: 1200 x 630 px
- **Format**: JPG oder PNG
- **Inhalt**: Musicify Logo + Slogan "Musik-Marktplatz & Custom Music Platform"
- **Design**: Professionell, ansprechend, mit Brand Colors

### 2. Twitter Image
- **Datei**: `/public/twitter-image.jpg`
- **Größe**: 1200 x 630 px
- **Format**: JPG oder PNG
- **Inhalt**: Kann identisch mit OG-Image sein

### 3. Logo
- **Datei**: `/public/logo.png`
- **Größe**: Mindestens 512 x 512 px (quadratisch)
- **Format**: PNG mit transparentem Hintergrund
- **Inhalt**: Musicify Logo

### 4. PWA Icons
- **Datei**: `/public/icon-192.png`
  - Größe: 192 x 192 px
  - Format: PNG
  
- **Datei**: `/public/icon-512.png`
  - Größe: 512 x 512 px
  - Format: PNG

### 5. Apple Touch Icon
- **Datei**: `/public/apple-touch-icon.png`
- **Größe**: 180 x 180 px
- **Format**: PNG
- **Inhalt**: Musicify Logo (ohne Transparenz, mit Hintergrund)

### 6. Favicon
- **Datei**: `/public/favicon.ico`
- **Größe**: 16x16, 32x32, 48x48 (Multi-Size ICO)
- **Format**: ICO
- **Tool**: https://realfavicongenerator.net/

### 7. SVG Icon
- **Datei**: `/public/icon.svg`
- **Format**: SVG
- **Inhalt**: Musicify Logo als Vektor
- **Hinweis**: Aktuell ist ein Platzhalter vorhanden

## 🔑 Verification Codes

### Google Search Console
1. Gehe zu: https://search.google.com/search-console
2. Füge die Property hinzu: `https://musicify.de`
3. Kopiere den Verification Code
4. Füge ihn in `app/layout.tsx` ein:
   ```typescript
   verification: {
     google: "DEIN_GOOGLE_CODE_HIER",
   }
   ```

### Yandex Webmaster
1. Gehe zu: https://webmaster.yandex.com/
2. Füge die Website hinzu
3. Kopiere den Verification Code
4. Füge ihn in `app/layout.tsx` ein:
   ```typescript
   verification: {
     yandex: "DEIN_YANDEX_CODE_HIER",
   }
   ```

## 📊 Analytics & Tracking

### Google Analytics
1. Erstelle ein GA4 Property
2. Installiere das Tracking-Script
3. Erstelle eine neue Datei: `app/google-analytics.tsx`
4. Füge das Script zum Layout hinzu

### Google Tag Manager (Optional)
1. Erstelle einen GTM Container
2. Installiere das GTM-Script
3. Konfiguriere Tags und Trigger

## 🔧 Weitere Konfigurationen

### 1. Sitemap bei Google einreichen
1. Öffne Google Search Console
2. Gehe zu "Sitemaps"
3. Füge hinzu: `https://musicify.de/sitemap.xml`

### 2. Social Media Meta-Tags testen
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### 3. Strukturierte Daten testen
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

### 4. Performance testen
- PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse (Chrome DevTools)
- WebPageTest: https://www.webpagetest.org/

## 📝 Inhalte aktualisieren

### Kontaktinformationen
Aktualisiere in folgenden Dateien:
- `components/seo/structured-data.tsx` - Telefonnummer, Adresse
- `public/ai-info.json` - Kontakt-Email
- `public/AI-README.md` - Kontakt-Infos
- `app/security.txt/route.ts` - Security-Email

### Social Media Links
Aktualisiere in:
- `components/seo/structured-data.tsx` - sameAs Array
- `public/ai-info.json` - Social Links

### Statistiken
Aktualisiere regelmäßig:
- `public/ai-info.json` - statistics
- `public/AI-README.md` - Statistics
- `components/seo/structured-data.tsx` - aggregateRating

## ✅ Checkliste

Nach Abschluss aller Schritte:

- [ ] Alle Bilder erstellt und hochgeladen
- [ ] Google Search Console Verification
- [ ] Yandex Webmaster Verification
- [ ] Sitemap bei Google eingereicht
- [ ] Social Media Meta-Tags getestet
- [ ] Strukturierte Daten getestet
- [ ] Performance getestet (Score > 90)
- [ ] Mobile-Freundlichkeit getestet
- [ ] Alle Kontaktinformationen aktualisiert
- [ ] Social Media Links hinzugefügt
- [ ] Analytics eingerichtet (optional)

## 🚀 Nach dem Launch

### Wöchentlich
- [ ] Google Search Console Fehler prüfen
- [ ] Rankings überwachen
- [ ] Core Web Vitals prüfen

### Monatlich
- [ ] Statistiken in SEO-Dateien aktualisieren
- [ ] Neue Inhalte für besseres Ranking
- [ ] Backlink-Profil prüfen

### Quartalsweise
- [ ] Vollständiges SEO-Audit
- [ ] Keyword-Recherche aktualisieren
- [ ] Konkurrenz-Analyse

## 📞 Support

Bei Fragen:
- Dokumentation: `/docs/SEO_OPTIMIZATION.md`
- SEO-Konfiguration: `/lib/seo-config.ts`

---

**Erstellt**: 26. Dezember 2025

