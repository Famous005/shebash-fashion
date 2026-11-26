-- ============================================================================
-- Shebash Fashion Design — PostgreSQL Schema
-- Supabase / PostgreSQL 15+
-- Location: Bida, Niger State, Nigeria | Currency: NGN
-- Converted from MySQL blueprint + additions agreed in Session 1
-- ============================================================================

-- ============================================================
-- 1. USERS & CUSTOMER PROFILES
-- ============================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    phone_e164 VARCHAR(25) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('customer', 'tailor_staff', 'admin')),
    preferred_currency CHAR(3) NOT NULL DEFAULT 'NGN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);

COMMENT ON COLUMN users.phone_e164 IS 'Format: +2348012345678 for WhatsApp alerts';

-- ============================================================
-- 2. DELIVERY ADDRESSES & LOGISTICS ZONES
-- ============================================================
CREATE TABLE customer_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(60) NOT NULL DEFAULT 'Home',
    recipient_name VARCHAR(150) NOT NULL,
    recipient_phone VARCHAR(25) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_region VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'NG',
    delivery_zone VARCHAR(30) NOT NULL
        CHECK (delivery_zone IN (
            'bida_local',
            'minna_abuja_corridor',
            'nigeria_nationwide',
            'international'
        )),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON customer_addresses(user_id);

-- ============================================================
-- 3. CUSTOMER MEASUREMENT VAULT
-- ============================================================
CREATE TABLE customer_measurements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_label VARCHAR(100) NOT NULL DEFAULT 'My Measurements',
    -- Body measurements (all in inches)
    bust DECIMAL(5,2),
    underbust DECIMAL(5,2),
    waist DECIMAL(5,2),
    hip DECIMAL(5,2),
    shoulder_width DECIMAL(5,2),
    half_length DECIMAL(5,2),
    blouse_length DECIMAL(5,2),
    sleeve_length DECIMAL(5,2),
    armhole DECIMAL(5,2),
    skirt_length DECIMAL(5,2),
    gown_length DECIMAL(5,2),
    -- Fit preferences
    fit_preference VARCHAR(20) NOT NULL DEFAULT 'standard_tailored'
        CHECK (fit_preference IN ('snug_fitted', 'standard_tailored', 'loose_flowing')),
    padding_preference VARCHAR(20) NOT NULL DEFAULT 'none'
        CHECK (padding_preference IN ('none', 'light_cup', 'structured_pushup')),
    lining_preference VARCHAR(25) NOT NULL DEFAULT 'full_cotton_lining'
        CHECK (lining_preference IN (
            'full_cotton_lining',
            'satin_lining',
            'unlined'
        )),
    -- How measurements were collected (three client paths)
    measurement_source VARCHAR(20) NOT NULL DEFAULT 'self_submitted'
        CHECK (measurement_source IN (
            'self_submitted',
            'staff_entered',
            'appointment_pending'
        )),
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_measurements_user ON customer_measurements(user_id);

COMMENT ON COLUMN customer_measurements.profile_label
    IS 'Allows saving measurements for self, daughter, or bridal party';
COMMENT ON COLUMN customer_measurements.measurement_source
    IS 'self_submitted=Path A online, staff_entered=Path B/C, appointment_pending=booked but not yet measured';

-- ============================================================
-- 4. PRODUCTS CATALOG (RTW & TAILORING MATERIALS)
-- ============================================================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    product_type VARCHAR(20) NOT NULL
        CHECK (product_type IN ('ready_to_wear', 'tailoring_material')),
    category VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    unit_label VARCHAR(30) NOT NULL DEFAULT 'piece',
    retail_price_ngn DECIMAL(12,2) NOT NULL,
    wholesale_price_ngn DECIMAL(12,2),
    wholesale_min_qty INT,
    weight_grams INT NOT NULL DEFAULT 500,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_type_active ON products(product_type, is_active);
CREATE INDEX idx_products_category ON products(category);

COMMENT ON COLUMN products.unit_label
    IS 'piece, set, yard, pack, dozen, cone';

-- ============================================================
-- 5. PRODUCT VARIANTS (SIZES, COLORS, GRADES)
-- ============================================================
CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_sku VARCHAR(80) NOT NULL UNIQUE,
    size_label VARCHAR(40),
    color_name VARCHAR(60),
    color_hex CHAR(7),
    stock_quantity INT NOT NULL DEFAULT 0,
    price_override_ngn DECIMAL(12,2),
    image_url VARCHAR(500)
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

COMMENT ON COLUMN product_variants.size_label
    IS 'UK 8, UK 10, Free Size, SS16, 22-inch';

-- ============================================================
-- 6. SERVICE CATALOG (SEWING, STONING, BEADWORK)
-- ============================================================
CREATE TABLE service_catalog (
    id BIGSERIAL PRIMARY KEY,
    service_code VARCHAR(40) NOT NULL UNIQUE,
    service_type VARCHAR(20) NOT NULL
        CHECK (service_type IN ('bespoke_sewing', 'stoning', 'beadwork')),
    name VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    base_price_ngn DECIMAL(12,2) NOT NULL,
    estimated_days INT NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_service_type ON service_catalog(service_type, is_active);

-- ============================================================
-- 7. MASTER ORDERS
-- ============================================================
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_reference VARCHAR(32) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    address_id BIGINT REFERENCES customer_addresses(id),
    -- Appointment support (Path B clients)
    appointment_datetime TIMESTAMPTZ,
    fulfillment_method VARCHAR(30) NOT NULL
        CHECK (fulfillment_method IN (
            'bida_workshop_pickup',
            'local_dispatch',
            'interstate_waybill',
            'international_courier'
        )),
    subtotal_ngn DECIMAL(12,2) NOT NULL,
    shipping_fee_ngn DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_ngn DECIMAL(12,2) NOT NULL,
    -- Payment
    payment_method VARCHAR(25) NOT NULL DEFAULT 'paystack'
        CHECK (payment_method IN (
            'paystack',
            'flutterwave',
            'manual_bank_transfer'
        )),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN (
            'pending',
            'deposit_paid',
            'paid',
            'failed',
            'refunded'
        )),
    gateway_reference VARCHAR(120) UNIQUE,
    -- Manual bank transfer fields (Session 7)
    manual_payment_proof_url VARCHAR(500),
    manual_payment_approved_by BIGINT REFERENCES users(id),
    manual_payment_approved_at TIMESTAMPTZ,
    -- Order status pipeline
    order_status VARCHAR(35) NOT NULL DEFAULT 'awaiting_payment'
        CHECK (order_status IN (
            'awaiting_payment',
            'confirmed',
            'measurement_verified',
            'cutting_and_sewing',
            'stoning_and_beading',
            'quality_check',
            'ready_for_pickup_or_dispatch',
            'completed',
            'cancelled'
        )),
    customer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment ON orders(payment_status);

COMMENT ON COLUMN orders.order_reference
    IS 'Format: SHB-20261126-8492';
COMMENT ON COLUMN orders.appointment_datetime
    IS 'Set for Path B clients who book to come in for measurements';
COMMENT ON COLUMN orders.manual_payment_proof_url
    IS 'Supabase Storage URL of uploaded payment receipt screenshot';

-- ============================================================
-- 8. ORDER PRODUCT LINE ITEMS
-- ============================================================
CREATE TABLE order_product_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id BIGINT NOT NULL REFERENCES product_variants(id),
    quantity INT NOT NULL,
    unit_price_ngn DECIMAL(12,2) NOT NULL,
    line_total_ngn DECIMAL(12,2) NOT NULL
);

-- ============================================================
-- 9. SERVICE BOOKINGS (SEWING, STONING, BEADWORK)
-- ============================================================
CREATE TABLE order_service_bookings (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES service_catalog(id),
    measurement_snapshot JSONB,
    fabric_source VARCHAR(35) NOT NULL
        CHECK (fabric_source IN (
            'client_supplied_dropoff_or_waybill',
            'purchased_from_store'
        )),
    embellishment_placement VARCHAR(25) NOT NULL DEFAULT 'none'
        CHECK (embellishment_placement IN (
            'none',
            'neckline_only',
            'neckline_and_sleeves',
            'scattered_full_body',
            'heavy_full_couture'
        )),
    stone_or_bead_color VARCHAR(80),
    reference_image_urls JSONB,
    agreed_price_ngn DECIMAL(12,2) NOT NULL,
    promised_delivery_date DATE NOT NULL,
    special_instructions TEXT
);

COMMENT ON COLUMN order_service_bookings.measurement_snapshot
    IS 'Immutable JSONB copy of measurements at time of booking';
COMMENT ON COLUMN order_service_bookings.reference_image_urls
    IS 'Array of Supabase Storage URLs for style inspiration photos';

-- ============================================================
-- 10. MANUAL BANK ACCOUNT DETAILS (Admin configures)
-- ============================================================
CREATE TABLE bank_account_settings (
    id BIGSERIAL PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by BIGINT REFERENCES users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE bank_account_settings
    IS 'Admin pastes bank details here; customers see them at checkout for manual transfer';

-- ============================================================
-- 11. LOOKBOOK / PORTFOLIO GALLERY
-- ============================================================
CREATE TABLE lookbook_items (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    service_tag VARCHAR(20) NOT NULL
        CHECK (service_tag IN (
            'bespoke_sewing',
            'stoning',
            'beadwork',
            'ready_to_wear'
        )),
    story_and_craftsmanship TEXT NOT NULL,
    cover_image_url VARCHAR(500) NOT NULL,
    gallery_image_urls JSONB,
    estimated_recreation_price_ngn DECIMAL(12,2),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lookbook_tag ON lookbook_items(service_tag, is_featured);

-- ============================================================
-- 12. NOTIFICATION LOGS (Brevo email + Termii WhatsApp)
-- ============================================================
CREATE TABLE notification_logs (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    channel VARCHAR(10) NOT NULL
        CHECK (channel IN ('whatsapp', 'email', 'sms')),
    recipient VARCHAR(191) NOT NULL,
    milestone_triggered VARCHAR(80) NOT NULL,
    delivery_status VARCHAR(10) NOT NULL DEFAULT 'queued'
        CHECK (delivery_status IN ('queued', 'sent', 'failed')),
    provider_message_id VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_order ON notification_logs(order_id);

-- ============================================================
-- 13. AUTO-UPDATE updated_at TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER trg_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bank_settings_updated
    BEFORE UPDATE ON bank_account_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();