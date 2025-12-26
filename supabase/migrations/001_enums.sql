-- ============================================
-- ENUMS für Musicify
-- ============================================

-- Benutzerrollen
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'DIRECTOR', 'ADMIN');

-- Director Badges
CREATE TYPE director_badge AS ENUM ('VERIFIED', 'TOP_SELLER', 'PREMIUM');

-- Lizenztypen
CREATE TYPE license_type AS ENUM ('PERSONAL', 'COMMERCIAL', 'ENTERPRISE', 'EXCLUSIVE');

-- Musik Status
CREATE TYPE music_status AS ENUM ('ACTIVE', 'INACTIVE', 'EXCLUSIVE_SOLD');

-- Order Status
CREATE TYPE order_status AS ENUM (
  'PENDING',           -- Auftrag erstellt, wartet auf Angebot
  'OFFER_PENDING',     -- Angebot abgegeben, wartet auf Annahme
  'OFFER_ACCEPTED',    -- Angebot angenommen, Produktion startet
  'IN_PROGRESS',       -- In Arbeit
  'REVISION_REQUESTED', -- Revision angefragt
  'READY_FOR_PAYMENT', -- Fertig, bereit zur Zahlung
  'PAID',              -- Bezahlt
  'COMPLETED',         -- Abgeschlossen
  'CANCELLED',         -- Storniert
  'DISPUTED'           -- Streitfall
);

-- Zahlungsmodell
CREATE TYPE payment_model AS ENUM ('PAY_ON_COMPLETION', 'PARTIAL_PAYMENT');

-- Zahlungsstatus
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Zahlungsmethode
CREATE TYPE payment_method AS ENUM ('CREDIT_CARD', 'PAYPAL');

-- Genehmigungsstatus
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Ticket Status
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- Ticket Typ
CREATE TYPE ticket_type AS ENUM ('GENERAL', 'DISPUTE', 'REFUND', 'TECHNICAL', 'OTHER');

