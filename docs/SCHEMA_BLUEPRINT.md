-- ============================================================================
-- MySQL 8.0+ Schema: Bespoke Fashion, Stoning/Beading & Tailoring Materials
-- Location: Bida, Niger State, Nigeria | Default Currency: NGN
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users & Customer Profiles
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    phone_e164 VARCHAR(25) NOT NULL UNIQUE COMMENT 'Format: +2348012345678 for WhatsApp alerts',
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'tailor_staff', 'admin') NOT NULL DEFAULT 'customer',
    preferred_currency CHAR(3) NOT NULL DEFAULT 'NGN',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Delivery Addresses & Nigerian Logistics Zones
CREATE TABLE customer_addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(60) NOT NULL DEFAULT 'Home',
    recipient_name VARCHAR(150) NOT NULL,
    recipient_phone VARCHAR(25) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_region VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'NG',
    delivery_zone ENUM('bida_local', 'minna_abuja_corridor', 'nigeria_nationwide', 'international') NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Reusable Customer Measurement Vault
CREATE TABLE customer_measurements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    profile_label VARCHAR(100) NOT NULL DEFAULT 'My Measurements' COMMENT 'Allows saving measurements for self, daughter, or bridal party',
    bust DECIMAL(5,2) NULL,
    underbust DECIMAL(5,2) NULL,
    waist DECIMAL(5,2) NULL,
    hip DECIMAL(5,2) NULL,
    shoulder_width DECIMAL(5,2) NULL,
    half_length DECIMAL(5,2) NULL,
    blouse_length DECIMAL(5,2) NULL,
    sleeve_length DECIMAL(5,2) NULL,
    armhole DECIMAL(5,2) NULL,
    skirt_length DECIMAL(5,2) NULL,
    gown_length DECIMAL(5,2) NULL,
    fit_preference ENUM('snug_fitted', 'standard_tailored', 'loose_flowing') NOT NULL DEFAULT 'standard_tailored',
    notes TEXT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_measurements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_measurements_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Physical Products Catalog (Ready-to-Wear Clothes & Tailoring Materials)
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    product_type ENUM('ready_to_wear', 'tailoring_material') NOT NULL,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    unit_label VARCHAR(30) NOT NULL DEFAULT 'piece' COMMENT 'piece, set, yard, pack, dozen, cone',
    retail_price_ngn DECIMAL(12,2) NOT NULL,
    wholesale_price_ngn DECIMAL(12,2) NULL,
    wholesale_min_qty INT UNSIGNED NULL,
    weight_grams INT UNSIGNED NOT NULL DEFAULT 500,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_type_active (product_type, is_active),
    INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Variants (Sizes for RTW, Colors/Grades for Materials)
CREATE TABLE product_variants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    variant_sku VARCHAR(80) NOT NULL UNIQUE,
    size_label VARCHAR(40) NULL COMMENT 'UK 8, UK 10, Free Size, SS16, 22-inch',
    color_name VARCHAR(60) NULL,
    color_hex CHAR(7) NULL,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    price_override_ngn DECIMAL(12,2) NULL,
    image_url VARCHAR(500) NULL,
    CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_variants_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Service Catalog (Bespoke Sewing, Stoning & Beadwork Tiers)
CREATE TABLE service_catalog (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(40) NOT NULL UNIQUE,
    service_type ENUM('bespoke_sewing', 'stoning', 'beadwork') NOT NULL,
    name VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    base_price_ngn DECIMAL(12,2) NOT NULL,
    estimated_days INT UNSIGNED NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_service_type (service_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Unified Master Orders
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_reference VARCHAR(32) NOT NULL UNIQUE COMMENT 'e.g., BDA-20261126-8492',
    user_id BIGINT UNSIGNED NOT NULL,
    address_id BIGINT UNSIGNED NULL,
    fulfillment_method ENUM('bida_workshop_pickup', 'local_dispatch', 'interstate_waybill', 'international_courier') NOT NULL,
    subtotal_ngn DECIMAL(12,2) NOT NULL,
    shipping_fee_ngn DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_ngn DECIMAL(12,2) NOT NULL,
    payment_gateway ENUM('paystack', 'flutterwave', 'bank_transfer_manual') NOT NULL DEFAULT 'paystack',
    payment_status ENUM('pending', 'deposit_paid', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    gateway_reference VARCHAR(120) NULL UNIQUE,
    order_status ENUM(
        'awaiting_payment',
        'confirmed',
        'measurement_verified',
        'cutting_and_sewing',
        'stoning_and_beading',
        'quality_check',
        'ready_for_pickup_or_dispatch',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'awaiting_payment',
    customer_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES customer_addresses(id),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_payment (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Physical Store Order Line Items
CREATE TABLE order_product_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price_ngn DECIMAL(12,2) NOT NULL,
    line_total_ngn DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bespoke Sewing, Stoning & Beadwork Bookings
CREATE TABLE order_service_bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    measurement_snapshot_json JSON NULL COMMENT 'Immutable copy of body measurements at time of booking',
    fabric_source ENUM('client_supplied_dropoff_or_waybill', 'purchased_from_store') NOT NULL,
    embellishment_placement ENUM('none', 'neckline_only', 'neckline_and_sleeves', 'scattered_full_body', 'heavy_full_couture') NOT NULL DEFAULT 'none',
    stone_or_bead_color VARCHAR(80) NULL,
    reference_image_urls JSON NULL COMMENT 'Array of uploaded style inspiration URLs',
    agreed_price_ngn DECIMAL(12,2) NOT NULL,
    promised_delivery_date DATE NOT NULL,
    special_instructions TEXT NULL,
    CONSTRAINT fk_bookings_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_service FOREIGN KEY (service_id) REFERENCES service_catalog(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Portfolio / Lookbook Gallery (Global Brand Awareness)
CREATE TABLE lookbook_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    service_tag ENUM('bespoke_sewing', 'stoning', 'beadwork', 'ready_to_wear') NOT NULL,
    story_and_craftsmanship TEXT NOT NULL,
    cover_image_url VARCHAR(500) NOT NULL,
    gallery_image_urls JSON NULL,
    estimated_recreation_price_ngn DECIMAL(12,2) NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lookbook_tag (service_tag, is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. WhatsApp & Email Notification Audit Log
CREATE TABLE notification_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    channel ENUM('whatsapp', 'email', 'sms') NOT NULL,
    recipient VARCHAR(191) NOT NULL,
    milestone_triggered VARCHAR(80) NOT NULL,
    delivery_status ENUM('queued', 'sent', 'failed') NOT NULL DEFAULT 'queued',
    provider_message_id VARCHAR(150) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_notifications_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;