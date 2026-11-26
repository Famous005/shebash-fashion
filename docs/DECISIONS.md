# Architecture Decision Log (DECISIONS.md)

## ADR-001: Regional Commerce, Currency & Payments (Bida, Niger State)
- **Date:** 2026-11-26
- **Status:** Accepted
- **Context:** The business operates from Bida, Niger State, Nigeria, serving walk-in local customers, nationwide Nigerian buyers, and international clients seeking bespoke Nigerian ladies' wear, embellishment, and tailoring supplies.
- **Decision:** 
  - Store all base prices in Nigerian Naira (`NGN` / `₦`) with optional live currency conversion display (USD, GBP, EUR) for international visitors.
  - Integrate **Paystack** as the primary payment gateway (with Flutterwave as secondary fallback) to accept Nigerian bank transfers, USSD, Verve/Mastercard/Visa, and international cards.
- **Consequences:** All monetary columns in MySQL must use `DECIMAL(12, 2)` in `NGN`. Webhook signature verification is mandatory before marking orders as paid.

## ADR-002: Delivery Zones & Logistics Model
- **Date:** 2026-11-26
- **Status:** Accepted
- **Context:** Delivery costs and timelines vary significantly between Bida town, neighboring Niger State/FCT cities, other Nigerian states, and overseas destinations.
- **Decision:** Implement four structured delivery zones:
  1. **Zone 1 (Bida Local):** Workshop pickup (Free) or local dispatch rider within Bida metropolis.
  2. **Zone 2 (Minna & Abuja Corridor):** Same-day/next-day interstate park waybill or regional courier.
  3. **Zone 3 (Rest of Nigeria):** Nationwide GIG Logistics / DHL / park waybill (2–5 business days).
  4. **Zone 4 (International):** DHL Express / FedEx international shipping calculated by weight.
- **Consequences:** Checkout must compute shipping fees dynamically based on the selected zone and total package weight (especially for heavy fabrics and wholesale tailoring materials).

## ADR-003: Automated WhatsApp & Email Order Milestone Alerts
- **Date:** 2026-11-26
- **Status:** Accepted
- **Context:** Nigerian tailoring and e-commerce clients rely heavily on WhatsApp for order confirmation, measurement verification, and pickup notifications.
- **Decision:** Trigger automated WhatsApp Cloud API (or Termii/Twilio) messages alongside transactional emails whenever an order moves through key statuses: `ORDER_CONFIRMED`, `MEASUREMENT_VERIFIED`, `SEWING_IN_PROGRESS`, `EMBELLISHMENT_IN_PROGRESS`, `READY_FOR_PICKUP_OR_DISPATCH`, and `DELIVERED`.
- **Consequences:** Customer phone numbers must be stored in standardized E.164 international format (`+234...`).

## ADR-004: Separation of Inventory Products & Bespoke Service Orders
- **Date:** 2026-11-26
- **Status:** Accepted
- **Context:** The platform handles both physical stock items (ready-to-wear dresses, fabrics, stones, beads, zippers) and custom labor workflows (sewing, stoning, beadwork).
- **Decision:** Model physical goods in `products` and `product_variants` with strict stock locking, while modeling custom tailoring, stoning, and beadwork in `service_orders` linked to reusable `customer_measurements`.
- **Consequences:** Clients can purchase tailoring materials and book a custom sewing/stoning service in one unified checkout, while returning clients can reuse saved body measurements.