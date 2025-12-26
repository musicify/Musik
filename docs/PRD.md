# Product Requirements Document (PRD)

## Musik-Marktplatz & Plattform für Auftragsmusik

---

## 1. Produktübersicht

### 1.1 Produktname

Music Marketplace & Custom Music Platform

### 1.2 Produktbeschreibung

Webbasierte Plattform zum Kauf lizenzierter Musik sowie zur Beauftragung individuell produzierter Musik bei ausgewählten Regisseuren/Komponisten. Das System kombiniert Marktplatz-Funktionen, Projektabwicklung, Chat-Kommunikation und Zahlungsprozesse.

---

## 2. Produktziele

- Bereitstellung eines strukturierten Musik-Marktplatzes
- Ermöglichung individueller Musikaufträge
- Transparente Kommunikation zwischen Kunde und Regisseur
- Sichere Zahlungs- und Lizenzabwicklung

---

## 3. Benutzerrollen

### 3.1 Kunde

- Musik durchsuchen und kaufen
- Individuelle Musikaufträge erstellen
- Chat mit Regisseur führen
- Musik bezahlen und herunterladen

### 3.2 Regisseur / Komponist

- Erhält Aufträge per E-Mail
- Kommuniziert mit Kunden im Chat
- Gibt Preis und Produktionszeit an
- Liefert fertige Musikdateien
- Verwaltet Profil mit Portfolio und Preisrahmen
- Kann Qualitäts-Badges erhalten (siehe 3.4)

### 3.3 Administrator

- Verwaltung von Musik, Nutzern und Regisseuren
- System- und Zahlungsüberwachung
- Inhaltsfreigaben
- Mediation bei Konflikten zwischen Kunde und Regisseur
- Qualitätsprüfung und Verifizierung von Regisseuren

### 3.4 Qualitätssicherung für Regisseure

**Verifizierungsprozess:**
- Portfolio-Prüfung bei Registrierung
- Mindestanforderungen:
  - 3-5 Sample-Tracks hochladen
  - Referenzen oder bisherige Projekte
  - Profilausfüllung (Erfahrung, Spezialisierungen)
- Manuelle Prüfung durch Administrator

**Qualitäts-Badges:**
- **Verifiziert:** Basis-Verifizierung abgeschlossen
- **Top-Seller:** Hohe Abschlussrate und positive Bewertungen
- **Premium:** Exzellente Qualität, schnelle Lieferzeiten, hohe Kundenzufriedenheit

**Performance-Metriken:**
- Durchschnittliche Antwortzeit
- Abschlussrate (abgeschlossene vs. abgebrochene Aufträge)
- Kundenzufriedenheit (wenn Bewertungssystem aktiv)
- Lieferzeit-Genauigkeit
- Revisionsrate

**Konsequenzen bei schlechter Performance:**
- Warnung bei wiederholten Problemen
- Temporäre Sperrung bei schwerwiegenden Verstößen
- Entfernung von Badges bei Qualitätsverlust

---

## 4. Funktionale Anforderungen

---

### 4.1 Bereich: Musik kaufen

#### 4.1.1 Beschreibung

Bereich zum Kauf sofort verfügbarer Musikstücke.

#### 4.1.2 Filter

- Genre
- Subgenre
- Stil
- Epoche
- Kultur
- Stimmung
- Verwendungszweck
- Struktur

**Anforderungen:**
- Mehrfachauswahl
- Dynamische Aktualisierung der Ergebnisse

---

#### 4.1.3 Musikliste

Anzeige passender Songs mit:
- Titel
- Kurzbeschreibung
- Preis
- Dauer
- Audio-Vorschau
- Button „In den Warenkorb"

---

#### 4.1.4 Song-Detailansicht

- Vollständige Beschreibung
- Alle Metadaten
- Audio-Preview
- Lizenzinformationen (siehe 4.1.5)
- Preis
- Button „In den Warenkorb"

#### 4.1.5 Lizenzmodelle

**Definierte Lizenztypen:**

- 🎵 **Personal License**
  - Private Nutzung
  - Keine kommerzielle Verwendung
  - Persönliche Projekte, Hobbys

- 🎬 **Commercial License**
  - Kommerzielle Nutzung erlaubt
  - Begrenzt auf Projekte bis X Views/Reichweite
  - YouTube, Social Media, kleine Werbekampagnen

- 🏢 **Enterprise License**
  - Unbegrenzte kommerzielle Nutzung
  - Keine Einschränkungen bei Reichweite
  - Große Werbekampagnen, TV, Film

- 🔒 **Exclusive License**
  - Exklusivrechte am Track
  - Track wird nach Kauf von der Plattform entfernt
  - Alle Rechte gehen an den Käufer über

**Anforderungen:**
- Lizenz-Vergleichstabelle bei jedem Track
- Upgrade-Option für bestehende Lizenzen
- Klare Darstellung der Nutzungsrechte

---

### 4.2 Bereich: Musik auf Bestellung

#### 4.2.1 Beschreibung

Bereich zur Erstellung individueller Musikaufträge.

#### 4.2.2 Filter

- Genre
- Subgenre
- Stil
- Epoche
- Kultur
- Stimmung
- Verwendungszweck
- Struktur
- Auswahl eines oder mehrerer Regisseure

**Preistransparenz:**
- Preisrahmen-Anzeige bei Regisseur-Profilen (z.B. "ab 200€")
- Indikative Preisklassen pro Genre/Stil
- Preiskalkulator basierend auf Länge, Komplexität, Lizenztyp

---

#### 4.2.3 Zusatzinformationen

Textfelder für:
- Beschreibung der Anforderungen
- Referenzen
- Hinweise für den Regisseur
- **Budget-Rahmen** (optional, hilft Regisseuren bei der Preisgestaltung)

---

#### 4.2.4 Auftrag erstellen

- Auftrag wird gespeichert
- **Auftrag editierbar VOR Angebots-Annahme** durch den Regisseur
- Nach Angebots-Annahme: Änderungsanfragen nur mit Zustimmung beider Parteien
- Versionierung der Auftragsdetails mit Änderungsprotokoll
- Nachtrag-Funktion für zusätzliche Anforderungen (mit Preisanpassung)
- Auftrag kann storniert werden (siehe 4.3.6)
- Auftrag wird automatisch per E-Mail an ausgewählte Regisseure gesendet

---

### 4.3 Auftrags-Chat

#### 4.3.1 Beschreibung

Für jeden Auftrag wird ein separater Chat erstellt.

#### 4.3.2 Funktionen

- Textnachrichten
- Datei-Uploads
- Statusmeldungen (In Arbeit, Rückfrage, Fertiggestellt)

---

#### 4.3.3 Angebot

Regisseur übermittelt:
- Preis
- Produktionsdauer

Kunde kann:
- Angebot annehmen
- Angebot ablehnen

---

#### 4.3.4 Fertigstellung

- Finale Musik wird hochgeladen
- Musik wird automatisch dem Warenkorb hinzugefügt
- Status: „Bereit zur Zahlung"

#### 4.3.5 Revisionsrunden

**Inkludierte Revisionen:**
- Standard: 2-3 Revisionen im vereinbarten Preis enthalten
- Zusätzliche Revisionen gegen Aufpreis möglich
- Revisionsanfragen müssen spezifisch formuliert sein
- Regisseur hat 48-72h Zeit für Revisionen (je nach Vereinbarung)

**Revisionsprozess:**
- Kunde kann Änderungswünsche im Chat äußern
- Status ändert sich zu "Revision angefragt"
- Regisseur bearbeitet und lädt neue Version hoch
- Zähler für verbleibende inkludierte Revisionen wird angezeigt

#### 4.3.6 Konfliktlösung & Streitbeilegung

**Eskalationsprozess:**
1. **Direkte Kommunikation:** Kunde und Regisseur versuchen Lösung im Chat
2. **Admin-Mediation:** Bei Uneinigkeit kann Admin als Mediator hinzugezogen werden
3. **Teilzahlungen/Milestones:** 
   - Optionale 30% Anzahlung bei Auftragsannahme
   - 70% bei Abnahme/Fertigstellung
   - Schützt beide Parteien
4. **Streitbeilegungsverfahren:**
   - Klare Regeln für Ablehnung von Musik
   - Fristen für Feedback (z.B. 7 Tage nach Lieferung)
   - Automatische Freigabe bei fehlendem Feedback nach Frist
   - Rückerstattungsrichtlinien bei berechtigten Ablehnungen

**Stornierungsregeln:**
- Stornierung vor Angebotsannahme: kostenlos
- Stornierung nach Angebotsannahme: je nach Fortschritt (Anzahlung kann einbehalten werden)
- Stornierung durch Regisseur: vollständige Rückerstattung

---

### 4.4 Warenkorb & Zahlung

#### 4.4.1 Warenkorb

Enthält:
- Gekaufte Musik
- Fertige Auftragsmusik

---

#### 4.4.2 Zahlung

**Zahlungsmodelle:**
- **Sofortzahlung:** Für gekaufte Musik (sofort verfügbar)
- **Auftragsmusik:** 
  - Option 1: Zahlung erst nach Fertigstellung (Standard)
  - Option 2: Teilzahlung (30% Anzahlung bei Annahme, 70% bei Abnahme)
- Unterstützte Zahlungsmethoden:
  - Kreditkarte
  - PayPal

**Zahlungssicherheit:**
- Escrow-System für Auftragsmusik (Geld wird treuhänderisch verwahrt)
- Freigabe erst nach Kundenbestätigung oder automatisch nach Frist

Nach Zahlung:
- Downloadfreigabe
- Rechnung per E-Mail
- Lizenzzertifikat per E-Mail

---

### 4.5 Benutzerkonto

**Kunde:**
- Bestellungen
- Chats
- Downloads
- Rechnungen

**Regisseur:**
- Aufträge
- Chats
- Uploads
- Profilverwaltung

---

## 5. Nicht-funktionale Anforderungen

- Responsive Design
- DSGVO-Konformität
- Sichere Authentifizierung
- Skalierbarkeit

---

## 6. Abhängigkeiten & Risiken

- Zahlungsanbieter
- E-Mail-Zustellung
- Datei-Hosting
- Lizenzrechtliche Inhalte

---

## 7. User Stories

### 7.1 Kunde (Customer)

| ID | Als... | möchte ich... | damit ich... |
|----|--------|---------------|--------------|
| US-C01 | Kunde | mich registrieren und anmelden können | Zugang zur Plattform habe |
| US-C02 | Kunde | Musik nach Genre, Stimmung und Verwendungszweck filtern | passende Tracks finde |
| US-C03 | Kunde | eine Audio-Vorschau anhören können | die Musik vor dem Kauf bewerten kann |
| US-C04 | Kunde | verschiedene Lizenztypen vergleichen | die richtige Lizenz für mein Projekt wählen kann |
| US-C05 | Kunde | Musik in den Warenkorb legen | mehrere Tracks auf einmal kaufen kann |
| US-C06 | Kunde | einen individuellen Musikauftrag erstellen | maßgeschneiderte Musik für mein Projekt bekomme |
| US-C07 | Kunde | Regisseure nach Portfolio und Spezialisierung auswählen | den richtigen Künstler für meinen Auftrag finde |
| US-C08 | Kunde | über den Chat mit dem Regisseur kommunizieren | Details besprechen und Feedback geben kann |
| US-C09 | Kunde | Revisionen anfordern können | zufrieden mit dem Endergebnis bin |
| US-C10 | Kunde | sicher mit Kreditkarte oder PayPal bezahlen | meine Einkäufe abschließen kann |
| US-C11 | Kunde | meine gekaufte Musik herunterladen | sie in meinen Projekten nutzen kann |
| US-C12 | Kunde | Rechnungen und Lizenzzertifikate erhalten | rechtlich abgesichert bin |
| US-C13 | Kunde | meine Bestellhistorie einsehen | vergangene Käufe nachverfolgen kann |

### 7.2 Regisseur / Komponist (Director)

| ID | Als... | möchte ich... | damit ich... |
|----|--------|---------------|--------------|
| US-D01 | Regisseur | mich als Komponist registrieren können | Aufträge erhalten kann |
| US-D02 | Regisseur | mein Portfolio mit Sample-Tracks anlegen | Kunden meine Arbeit zeigen kann |
| US-D03 | Regisseur | meine Spezialisierungen und Preisrahmen angeben | passende Aufträge erhalte |
| US-D04 | Regisseur | neue Aufträge per E-Mail erhalten | schnell reagieren kann |
| US-D05 | Regisseur | ein Angebot mit Preis und Produktionszeit abgeben | den Auftrag annehmen kann |
| US-D06 | Regisseur | über den Chat mit dem Kunden kommunizieren | Anforderungen klären kann |
| US-D07 | Regisseur | Arbeitsdateien und finale Musik hochladen | Ergebnisse liefern kann |
| US-D08 | Regisseur | den Auftragsstatus aktualisieren | den Kunden auf dem Laufenden halte |
| US-D09 | Regisseur | meine Performance-Metriken einsehen | meine Arbeit verbessern kann |
| US-D10 | Regisseur | Qualitäts-Badges verdienen | meine Reputation aufbauen kann |
| US-D11 | Regisseur | fertige Musik zum Verkauf auf dem Marktplatz anbieten | passives Einkommen generieren kann |

### 7.3 Administrator

| ID | Als... | möchte ich... | damit ich... |
|----|--------|---------------|--------------|
| US-A01 | Admin | neue Regisseure verifizieren können | nur qualifizierte Künstler auf der Plattform sind |
| US-A02 | Admin | Musik freigeben oder ablehnen | die Qualität des Marktplatzes sichern kann |
| US-A03 | Admin | Nutzer verwalten (sperren/entsperren) | gegen Verstöße vorgehen kann |
| US-A04 | Admin | bei Streitfällen vermitteln | faire Lösungen finden kann |
| US-A05 | Admin | Plattform-Statistiken einsehen | die Performance überwachen kann |
| US-A06 | Admin | Zahlungen und Transaktionen überwachen | finanzielle Integrität gewährleiste |
| US-A07 | Admin | Badges vergeben und entziehen | Qualitätsstandards durchsetzen kann |

---

## 8. UI/UX Anforderungen

### 8.1 Design-Prinzipien

- **Modern & Professionell:** Klares, aufgeräumtes Design für kreative Professionals
- **Dark/Light Mode:** Unterstützung für beide Modi
- **Responsive:** Optimiert für Desktop, Tablet und Mobile
- **Accessibility:** WCAG 2.1 AA Konformität

### 8.2 Hauptseiten & Layouts

#### 8.2.1 Landing Page
- Hero-Section mit Value Proposition
- Feature-Highlights (Marktplatz, Custom Music, Sichere Zahlungen)
- Vorgestellte Tracks mit Audio-Vorschau
- Regisseur-Spotlight
- Call-to-Action Buttons
- Footer mit rechtlichen Links

#### 8.2.2 Marktplatz (Musik kaufen)
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]    Musik kaufen    Custom Music    [Login] [Warenkorb] │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌─────────────────────────────────────┐  │
│  │   FILTER         │  │  Suchergebnisse (234 Tracks)        │  │
│  │                  │  │                                     │  │
│  │  Genre           │  │  ┌─────────────────────────────┐    │  │
│  │  ○ Electronic    │  │  │ 🎵 Track Title              │    │  │
│  │  ○ Cinematic     │  │  │    Artist Name              │    │  │
│  │  ○ Pop           │  │  │    [▶ Waveform      ] 3:24  │    │  │
│  │                  │  │  │    €49 | Commercial         │    │  │
│  │  Stimmung        │  │  │    [In den Warenkorb]       │    │  │
│  │  ○ Energetic     │  │  └─────────────────────────────┘    │  │
│  │  ○ Melancholic   │  │                                     │  │
│  │  ○ Uplifting     │  │  ┌─────────────────────────────┐    │  │
│  │                  │  │  │ 🎵 Another Track            │    │  │
│  │  Verwendung      │  │  │    ...                      │    │  │
│  │  ○ Werbung       │  │  └─────────────────────────────┘    │  │
│  │  ○ Film          │  │                                     │  │
│  │  ○ Gaming        │  │                                     │  │
│  │                  │  │                                     │  │
│  │  Preis           │  │                                     │  │
│  │  [===●===] €0-500│  │                                     │  │
│  │                  │  │                                     │  │
│  │  [Filter zurück] │  │  [Seite 1] [2] [3] ... [>]          │  │
│  └──────────────────┘  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### 8.2.3 Track-Detailseite
- Großer Audio-Player mit Waveform-Visualisierung
- Vollständige Metadaten
- Lizenz-Vergleichstabelle mit Preisen
- Ähnliche Tracks
- Regisseur-Info mit Portfolio-Link

#### 8.2.4 Custom Music (Auftrag erstellen)
```
┌─────────────────────────────────────────────────────────────────┐
│                    MUSIK AUF BESTELLUNG                         │
├─────────────────────────────────────────────────────────────────┤
│  Schritt 1 von 4: Stil & Genre                                  │
│  ═══════════●═══════════════════                               │
│                                                                 │
│  Welches Genre suchen Sie?                                      │
│  [Electronic] [Cinematic] [Pop] [Rock] [Classical] [...]       │
│                                                                 │
│  Welche Stimmung soll die Musik haben?                          │
│  [Energetic] [Melancholic] [Uplifting] [Dramatic] [...]        │
│                                                                 │
│  Wofür wird die Musik verwendet?                                │
│  [Werbung] [YouTube Video] [Film/TV] [Podcast] [Gaming] [...]  │
│                                                                 │
│                              [Weiter →]                         │
└─────────────────────────────────────────────────────────────────┘
```

#### 8.2.5 Regisseur-Auswahl
- Regisseur-Cards mit:
  - Profilbild
  - Name und Badges
  - Spezialisierungen
  - Preisrahmen ("ab €200")
  - Performance-Indikatoren (Antwortzeit, Bewertung)
  - Portfolio-Vorschau (Mini-Player)
- Filter nach Spezialisierung und Preis
- Vergleichsfunktion für mehrere Regisseure

#### 8.2.6 Auftrags-Chat
```
┌─────────────────────────────────────────────────────────────────┐
│  Auftrag #2024-001: Corporate Video Soundtrack                  │
│  Status: IN ARBEIT | Regisseur: Max Müller | Revisionen: 1/2   │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [Max Müller, 10:34]                                      │  │
│  │  Hier ist der erste Entwurf! Ich habe versucht, die       │  │
│  │  energetische Stimmung einzufangen, die Sie beschrieben   │  │
│  │  haben.                                                   │  │
│  │  🎵 draft_v1.mp3 [▶────────────] 2:30                    │  │
│  │                                                           │  │
│  │  [Sie, 11:02]                                             │  │
│  │  Super Anfang! Könnten Sie ab 1:20 etwas mehr Dynamik     │  │
│  │  reinbringen?                                             │  │
│  │                                                           │  │
│  │  [Max Müller, 14:15]                                      │  │
│  │  Klar, arbeite daran! Werde gegen Ende des Tages eine     │  │
│  │  neue Version hochladen.                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [Nachricht eingeben...]               [📎] [📁] [Senden]│  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Angebot: €450 | Produktionszeit: 5 Tage | Lizenz: Commercial  │
│  [Angebot angenommen ✓]                                         │
└─────────────────────────────────────────────────────────────────┘
```

#### 8.2.7 Warenkorb & Checkout
- Übersichtliche Artikelliste
- Lizenz-Upgrade-Option
- Rabattcode-Eingabe
- Zahlungsmethoden-Auswahl
- Sichere Checkout-Seite (Stripe)

#### 8.2.8 Dashboard (Kunde)
- Aktive Aufträge mit Status
- Letzte Einkäufe
- Chat-Benachrichtigungen
- Download-Center
- Rechnungsübersicht

#### 8.2.9 Dashboard (Regisseur)
- Neue Auftragsanfragen
- Aktive Projekte
- Performance-Metriken
- Einnahmen-Übersicht
- Portfolio-Verwaltung

#### 8.2.10 Admin Dashboard
- Übersichts-KPIs
- Pending Verifications
- Support-Tickets
- Transaktions-Monitor
- User Management

### 8.3 Komponenten-Bibliothek

| Komponente | Beschreibung |
|------------|--------------|
| AudioPlayer | Waveform-basierter Player mit Play/Pause, Seek, Volume |
| FilterPanel | Collapsible Filter mit Checkboxen und Sliders |
| MusicCard | Track-Vorschau mit Mini-Player und Quick Actions |
| DirectorCard | Profil-Card mit Portfolio-Preview |
| ChatBubble | Message-Komponente mit Datei-Support |
| LicenseTable | Vergleichstabelle für Lizenztypen |
| BadgeDisplay | Anzeige für Qualitäts-Badges |
| OrderTimeline | Visualisierung des Auftragsstatus |

---

## 9. Datenmodell

### 9.1 Entity-Relationship-Diagramm (Übersicht)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│     User     │───────│ DirectorProfile  │───────│    Music     │
│              │       │                  │       │              │
│ - email      │       │ - bio            │       │ - title      │
│ - name       │       │ - badges         │       │ - genre      │
│ - role       │       │ - priceRange     │       │ - price      │
│ - ...        │       │ - metrics        │       │ - audioUrl   │
└──────────────┘       └──────────────────┘       └──────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌──────────────┐       ┌──────────────────┐
│    Order     │───────│      Chat        │
│              │       │                  │
│ - status     │       │ - messages       │
│ - budget     │       │ - participants   │
│ - offer      │       │                  │
└──────────────┘       └──────────────────┘
       │
       │
       ▼
┌──────────────┐       ┌──────────────────┐
│   Invoice    │───────│   InvoiceItem    │
│              │       │                  │
│ - amount     │       │ - price          │
│ - status     │       │ - licenseType    │
│ - stripeId   │       │                  │
└──────────────┘       └──────────────────┘
```

### 9.2 Haupt-Entitäten

#### User
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | String (CUID) | Primärschlüssel |
| email | String | Unique, für Login |
| name | String? | Anzeigename |
| role | UserRole | CUSTOMER, DIRECTOR, ADMIN |
| emailVerified | DateTime? | Verifizierungszeitpunkt |
| image | String? | Profilbild-URL |

#### DirectorProfile
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| bio | Text | Über mich |
| specialization | String[] | Genre-Spezialisierungen |
| priceRangeMin/Max | Float | Preisrahmen |
| badges | DirectorBadge[] | VERIFIED, TOP_SELLER, PREMIUM |
| avgResponseTime | Int | Durchschnittl. Antwortzeit (Stunden) |
| completionRate | Float | Abschlussrate (%) |

#### Music
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| title | String | Titel des Tracks |
| description | Text | Vollständige Beschreibung |
| duration | Int | Länge in Sekunden |
| price | Float | Grundpreis |
| audioUrl | String | S3/Cloudinary URL |
| previewUrl | String? | Vorschau-Snippet |
| licenseType | LicenseType | Standard-Lizenztyp |
| genre, subgenre, style, era, culture, mood, useCase, structure | String? | Metadaten/Filter |

#### Order
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| orderNumber | String | Eindeutige Auftragsnummer |
| status | OrderStatus | PENDING → COMPLETED/CANCELLED |
| title | String | Auftragsbezeichnung |
| description | Text | Detaillierte Anforderungen |
| budget | Float? | Kundenbudget |
| offeredPrice | Float? | Angebotener Preis |
| productionTime | Int? | Lieferzeit in Tagen |
| includedRevisions | Int | Inkl. Revisionen |
| usedRevisions | Int | Verwendete Revisionen |

### 9.3 Enumerationen

```typescript
enum UserRole {
  CUSTOMER    // Käufer
  DIRECTOR    // Regisseur/Komponist
  ADMIN       // Administrator
}

enum LicenseType {
  PERSONAL    // Privat, nicht-kommerziell
  COMMERCIAL  // Kommerziell, begrenzte Reichweite
  ENTERPRISE  // Unbegrenzt kommerziell
  EXCLUSIVE   // Exklusivrechte
}

enum OrderStatus {
  PENDING            // Wartet auf Angebot
  OFFER_PENDING      // Angebot abgegeben
  OFFER_ACCEPTED     // Angebot angenommen
  IN_PROGRESS        // In Bearbeitung
  REVISION_REQUESTED // Revision angefragt
  READY_FOR_PAYMENT  // Bereit zur Zahlung
  PAID               // Bezahlt
  COMPLETED          // Abgeschlossen
  CANCELLED          // Storniert
  DISPUTED           // Streitfall
}

enum DirectorBadge {
  VERIFIED    // Basis-Verifizierung
  TOP_SELLER  // Top-Verkäufer
  PREMIUM     // Premium-Status
}
```

---

## 10. API-Spezifikation

### 10.1 Authentifizierung

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/auth/signin` | POST | Login |
| `/api/auth/signup` | POST | Registrierung |
| `/api/auth/signout` | POST | Logout |
| `/api/auth/session` | GET | Aktuelle Session |
| `/api/auth/verify-email` | POST | E-Mail verifizieren |

### 10.2 Musik-Katalog

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/music` | GET | Liste aller Tracks (mit Filter) |
| `/api/music/[id]` | GET | Track-Details |
| `/api/music` | POST | Track erstellen (Director) |
| `/api/music/[id]` | PUT | Track aktualisieren |
| `/api/music/[id]` | DELETE | Track löschen |
| `/api/music/search` | GET | Erweiterte Suche |

**Query-Parameter für `/api/music`:**
```
?genre=electronic
&mood=energetic
&useCase=advertising
&priceMin=50
&priceMax=200
&page=1
&limit=20
&sort=newest
```

### 10.3 Aufträge (Orders)

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/orders` | GET | Eigene Aufträge |
| `/api/orders` | POST | Neuen Auftrag erstellen |
| `/api/orders/[id]` | GET | Auftrags-Details |
| `/api/orders/[id]` | PUT | Auftrag aktualisieren |
| `/api/orders/[id]/offer` | POST | Angebot abgeben (Director) |
| `/api/orders/[id]/accept` | POST | Angebot annehmen |
| `/api/orders/[id]/reject` | POST | Angebot ablehnen |
| `/api/orders/[id]/deliver` | POST | Musik liefern |
| `/api/orders/[id]/revision` | POST | Revision anfordern |
| `/api/orders/[id]/complete` | POST | Auftrag abschließen |
| `/api/orders/[id]/cancel` | POST | Auftrag stornieren |

### 10.4 Chat

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/chats` | GET | Alle Chats des Users |
| `/api/chats/[orderId]` | GET | Chat für Auftrag |
| `/api/chats/[orderId]/messages` | GET | Nachrichten laden |
| `/api/chats/[orderId]/messages` | POST | Nachricht senden |
| `/api/chats/[orderId]/upload` | POST | Datei hochladen |

**WebSocket Events (Socket.io):**
```typescript
// Client → Server
socket.emit('join-chat', { orderId })
socket.emit('send-message', { orderId, content, fileUrl? })
socket.emit('typing', { orderId })

// Server → Client
socket.on('new-message', (message) => {})
socket.on('user-typing', (userId) => {})
socket.on('order-status-changed', (status) => {})
```

### 10.5 Warenkorb & Zahlung

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/cart` | GET | Warenkorb abrufen |
| `/api/cart` | POST | Item hinzufügen |
| `/api/cart/[itemId]` | DELETE | Item entfernen |
| `/api/cart/[itemId]` | PUT | Lizenz ändern |
| `/api/checkout` | POST | Checkout initiieren |
| `/api/checkout/webhook` | POST | Stripe Webhook |
| `/api/invoices` | GET | Rechnungen abrufen |
| `/api/invoices/[id]/download` | GET | Rechnung als PDF |

### 10.6 Regisseur (Director)

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/directors` | GET | Alle Regisseure |
| `/api/directors/[id]` | GET | Regisseur-Profil |
| `/api/directors/profile` | GET | Eigenes Profil |
| `/api/directors/profile` | PUT | Profil aktualisieren |
| `/api/directors/portfolio` | POST | Portfolio-Track hochladen |
| `/api/directors/stats` | GET | Performance-Statistiken |

### 10.7 Admin

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/admin/users` | GET | Alle Nutzer |
| `/api/admin/users/[id]` | PUT | Nutzer bearbeiten |
| `/api/admin/directors/pending` | GET | Ausstehende Verifizierungen |
| `/api/admin/directors/[id]/verify` | POST | Regisseur verifizieren |
| `/api/admin/music/pending` | GET | Ausstehende Musik-Freigaben |
| `/api/admin/music/[id]/approve` | POST | Musik freigeben |
| `/api/admin/stats` | GET | Plattform-Statistiken |
| `/api/admin/disputes` | GET | Offene Streitfälle |

### 10.8 Upload

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/upload/audio` | POST | Audio hochladen (S3 presigned URL) |
| `/api/upload/image` | POST | Bild hochladen |
| `/api/upload/document` | POST | Dokument hochladen |

---

## 11. Sicherheitsanforderungen

### 11.1 Authentifizierung & Autorisierung

- **OAuth 2.0 / OpenID Connect** über NextAuth.js
- **JWT-basierte Sessions** mit httpOnly Cookies
- **Rollenbasierte Zugriffskontrolle (RBAC)**
  - CUSTOMER: Nur eigene Daten
  - DIRECTOR: Eigene Aufträge + Profil
  - ADMIN: Vollzugriff
- **Multi-Factor Authentication (MFA)** für Admin-Accounts (optional)

### 11.2 Datenschutz (DSGVO)

- **Einwilligung:** Cookie-Banner für Tracking
- **Datenexport:** Nutzer können ihre Daten exportieren
- **Löschrecht:** Account-Löschung mit Datenbereinigung
- **Datenschutzerklärung:** Transparente Information
- **Auftragsverarbeitung:** AVV mit Drittanbietern (Stripe, S3)

### 11.3 Zahlungssicherheit

- **PCI DSS Compliance** durch Stripe
- **Keine Speicherung von Kartendaten**
- **3D Secure** für Kreditkartenzahlungen
- **Escrow-System** für Auftragsmusik

### 11.4 Anwendungssicherheit

- **Input Validation:** Zod-Schemas für alle Eingaben
- **XSS Protection:** Escaping von User-Content
- **CSRF Protection:** CSRF-Tokens für Formulare
- **Rate Limiting:** Schutz vor Brute-Force und DoS
- **Content Security Policy (CSP)** Headers
- **HTTPS-Only:** Keine unverschlüsselten Verbindungen

### 11.5 Dateisicherheit

- **Virus-Scanning** für hochgeladene Dateien
- **Dateitypvalidierung** (nur erlaubte Formate)
- **Größenlimits** für Uploads
- **Presigned URLs** für sichere Downloads
- **Wasserzeichen** für Audio-Previews

### 11.6 Monitoring & Logging

- **Security Audit Logs** für kritische Aktionen
- **Error Tracking** (Sentry o.ä.)
- **Anomalie-Erkennung** für verdächtige Aktivitäten
- **Regelmäßige Security Audits**

---

## 12. Erfolgskriterien & KPIs

### 12.1 Geschäftliche KPIs

| KPI | Ziel (6 Monate) | Ziel (12 Monate) |
|-----|-----------------|------------------|
| Registrierte Nutzer | 1.000 | 5.000 |
| Aktive Kunden (monatlich) | 200 | 1.000 |
| Verifizierte Regisseure | 20 | 50 |
| Verkaufte Tracks | 500 | 3.000 |
| Custom Music Aufträge | 50 | 300 |
| Umsatz | €25.000 | €150.000 |
| Durchschnittlicher Warenkorbwert | €80 | €100 |

### 12.2 Nutzungsmetriken

| Metrik | Zielwert |
|--------|----------|
| Conversion Rate (Besucher → Kauf) | > 3% |
| Auftrags-Abschlussrate | > 85% |
| Durchschnittliche Auftragsdauer | < 10 Tage |
| Wiederkehrende Kunden | > 30% |
| Net Promoter Score (NPS) | > 40 |

### 12.3 Technische KPIs

| Metrik | Zielwert |
|--------|----------|
| Seiten-Ladezeit (LCP) | < 2.5s |
| Uptime | > 99.5% |
| API Response Time (p95) | < 500ms |
| Error Rate | < 0.1% |
| Mobile PageSpeed Score | > 80 |

### 12.4 Qualitätsmetriken

| Metrik | Zielwert |
|--------|----------|
| Regisseur-Antwortzeit | < 24h |
| Kundenzufriedenheit (CSAT) | > 4.5/5 |
| Support-Ticket-Lösungszeit | < 48h |
| Streitfallrate | < 2% |
| Refund-Rate | < 3% |

---

## 13. Glossar

| Begriff | Definition |
|---------|------------|
| **Track** | Ein einzelnes Musikstück im Katalog |
| **Regisseur/Director** | Musikproduzent/Komponist, der Musik erstellt |
| **Custom Music** | Individuell für einen Kunden produzierte Musik |
| **Lizenz** | Nutzungsrecht für ein Musikstück |
| **Escrow** | Treuhänderische Verwahrung von Zahlungen |
| **Revision** | Überarbeitung eines gelieferten Musikstücks |
| **Badge** | Qualitätsauszeichnung für Regisseure |
| **Marktplatz** | Bereich zum Kauf fertiger Musik |
| **Waveform** | Visuelle Darstellung einer Audio-Wellenform |
| **Preview** | Vorschau/Hörprobe eines Tracks |
| **Portfolio** | Sammlung von Arbeitsproben eines Regisseurs |
| **Verifizierung** | Überprüfung und Freigabe eines Regisseur-Profils |

---

## 14. Timeline & Roadmap

### Phase 1: Foundation (Wochen 1-4)
- [ ] Projekt-Setup (Next.js, Prisma, Tailwind)
- [ ] Datenbank-Schema implementieren
- [ ] Authentifizierung (NextAuth)
- [ ] Basis-Layout und Navigation
- [ ] User-Registrierung (Kunde & Regisseur)

### Phase 2: Core Marketplace (Wochen 5-8)
- [ ] Musik-Katalog mit Filtern
- [ ] Audio-Player mit Waveform
- [ ] Track-Detailseiten
- [ ] Lizenz-System
- [ ] Warenkorb
- [ ] Stripe-Integration

### Phase 3: Custom Music (Wochen 9-12)
- [ ] Auftrags-Erstellung (Wizard)
- [ ] Regisseur-Auswahl
- [ ] Angebots-System
- [ ] Echtzeit-Chat (Socket.io)
- [ ] Datei-Upload für Musik
- [ ] Revisions-Workflow

### Phase 4: User Dashboards (Wochen 13-16)
- [ ] Kunden-Dashboard
- [ ] Regisseur-Dashboard
- [ ] Download-Center
- [ ] Rechnungen & Lizenzzertifikate
- [ ] E-Mail-Benachrichtigungen

### Phase 5: Admin & Qualität (Wochen 17-20)
- [ ] Admin-Dashboard
- [ ] Regisseur-Verifizierung
- [ ] Musik-Freigabe-Workflow
- [ ] Performance-Metriken
- [ ] Badge-System
- [ ] Streitfall-Management

### Phase 6: Polish & Launch (Wochen 21-24)
- [ ] UI/UX Optimierung
- [ ] Performance-Optimierung
- [ ] Security Audit
- [ ] Testing (E2E, Integration)
- [ ] Dokumentation
- [ ] Soft Launch mit Beta-Nutzern

### Future Releases (Post-Launch)
- Bewertungssystem für Regisseure
- Abonnement-Modelle
- KI-gestützte Musik-Empfehlungen
- Mobile App
- Erweiterte Lizenzmodelle
- Multi-Language Support

---

## 15. Zukünftige Erweiterungen

- **Bewertungssystem:** Kunden bewerten Regisseure und Musik
- **Abonnement-Modelle:** Monatliche Downloads für Kunden
- **KI-Empfehlungen:** Personalisierte Musikvorschläge
- **Mobile App:** Native iOS/Android Apps
- **Erweiterte Lizenzen:** Synchronisationsrechte, Territory-Lizenzen
- **API für Drittanbieter:** Integration in Video-Editoren
- **Mehrsprachigkeit:** EN, DE, FR, ES
- **Affiliate-Programm:** Partner-Provisionen

