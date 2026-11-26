# [Django] backend/products/seed.py
# Run with: python manage.py shell < products/seed.py

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Product, ProductVariant

print("Seeding products...")

# Clear existing products first
ProductVariant.objects.all().delete()
Product.objects.all().delete()

products_data = [
    {
        'sku': 'RTW-001',
        'product_type': 'ready_to_wear',
        'category': 'Dresses',
        'name': 'Adire Silk Luxury Bubu (Free Size)',
        'slug': 'adire-silk-luxury-bubu-free-size',
        'description': 'Ready-to-ship hand-dyed silk adire boubou with stoned neckline. Fits UK Sizes 8-18.',
        'unit_label': 'piece',
        'retail_price_ngn': 28000.00,
        'wholesale_price_ngn': 23000.00,
        'wholesale_min_qty': 5,
        'weight_grams': 600,
        'variants': [
            {'variant_sku': 'RTW-001-BLUE', 'color_name': 'Royal Blue', 'color_hex': '#4169E1', 'stock_quantity': 10},
            {'variant_sku': 'RTW-001-GREEN', 'color_name': 'Emerald Green', 'color_hex': '#50C878', 'stock_quantity': 8},
        ]
    },
    {
        'sku': 'RTW-002',
        'product_type': 'ready_to_wear',
        'category': 'Two-Piece Sets',
        'name': 'Ankara Peplum Top & Pencil Skirt Set',
        'slug': 'ankara-peplum-top-pencil-skirt-set',
        'description': 'Ready-to-wear structured peplum set with concealed back zipper.',
        'unit_label': 'set',
        'retail_price_ngn': 22000.00,
        'wholesale_price_ngn': 18500.00,
        'wholesale_min_qty': 5,
        'weight_grams': 500,
        'variants': [
            {'variant_sku': 'RTW-002-UK8', 'size_label': 'UK 8', 'stock_quantity': 5},
            {'variant_sku': 'RTW-002-UK10', 'size_label': 'UK 10', 'stock_quantity': 7},
            {'variant_sku': 'RTW-002-UK12', 'size_label': 'UK 12', 'stock_quantity': 6},
            {'variant_sku': 'RTW-002-UK14', 'size_label': 'UK 14', 'stock_quantity': 4},
            {'variant_sku': 'RTW-002-UK16', 'size_label': 'UK 16', 'stock_quantity': 3},
        ]
    },
    {
        'sku': 'RTW-003',
        'product_type': 'ready_to_wear',
        'category': 'Occasion Wear',
        'name': 'Stoned Crepe Dinner Gown',
        'slug': 'stoned-crepe-dinner-gown',
        'description': 'Ready-to-wear floor-length crepe gown with crystal sleeve trim.',
        'unit_label': 'piece',
        'retail_price_ngn': 35000.00,
        'wholesale_price_ngn': 30000.00,
        'wholesale_min_qty': 4,
        'weight_grams': 700,
        'variants': [
            {'variant_sku': 'RTW-003-UK8', 'size_label': 'UK 8', 'stock_quantity': 3},
            {'variant_sku': 'RTW-003-UK10', 'size_label': 'UK 10', 'stock_quantity': 4},
            {'variant_sku': 'RTW-003-UK12', 'size_label': 'UK 12', 'stock_quantity': 4},
            {'variant_sku': 'RTW-003-UK14', 'size_label': 'UK 14', 'stock_quantity': 2},
            {'variant_sku': 'RTW-003-UK16', 'size_label': 'UK 16', 'stock_quantity': 2},
        ]
    },
    {
        'sku': 'MAT-001',
        'product_type': 'tailoring_material',
        'category': 'Fabrics',
        'name': 'Duchess Satin Fabric (High Grade)',
        'slug': 'duchess-satin-fabric-high-grade',
        'description': 'Heavy bridal-grade duchess satin 60-inch width. Multiple colors available.',
        'unit_label': 'yard',
        'retail_price_ngn': 4500.00,
        'wholesale_price_ngn': 3800.00,
        'wholesale_min_qty': 12,
        'weight_grams': 400,
        'variants': [
            {'variant_sku': 'MAT-001-WHITE', 'color_name': 'White', 'color_hex': '#FFFFFF', 'stock_quantity': 50},
            {'variant_sku': 'MAT-001-IVORY', 'color_name': 'Ivory', 'color_hex': '#FFFFF0', 'stock_quantity': 40},
            {'variant_sku': 'MAT-001-BLACK', 'color_name': 'Black', 'color_hex': '#000000', 'stock_quantity': 35},
            {'variant_sku': 'MAT-001-GOLD', 'color_name': 'Gold', 'color_hex': '#FFD700', 'stock_quantity': 30},
        ]
    },
    {
        'sku': 'MAT-002',
        'product_type': 'tailoring_material',
        'category': 'Fabrics',
        'name': 'Scuba / Crepe Dress Fabric',
        'slug': 'scuba-crepe-dress-fabric',
        'description': 'Stretch medium-weight crepe suitable for fitted gowns. Non-transparent wrinkle-resistant finish.',
        'unit_label': 'yard',
        'retail_price_ngn': 3500.00,
        'wholesale_price_ngn': 3000.00,
        'wholesale_min_qty': 12,
        'weight_grams': 350,
        'variants': [
            {'variant_sku': 'MAT-002-BLACK', 'color_name': 'Black', 'color_hex': '#000000', 'stock_quantity': 60},
            {'variant_sku': 'MAT-002-WINE', 'color_name': 'Wine', 'color_hex': '#722F37', 'stock_quantity': 45},
            {'variant_sku': 'MAT-002-NAVY', 'color_name': 'Navy', 'color_hex': '#000080', 'stock_quantity': 40},
        ]
    },
    {
        'sku': 'MAT-003',
        'product_type': 'tailoring_material',
        'category': 'Stones & Beads',
        'name': 'DMC Hotfix Crystal Stones (SS16/SS20)',
        'slug': 'dmc-hotfix-crystal-stones-ss16-ss20',
        'description': 'High-shine heat-activated rhinestones (1440 pcs per gross pack).',
        'unit_label': 'pack',
        'retail_price_ngn': 3500.00,
        'wholesale_price_ngn': 2900.00,
        'wholesale_min_qty': 10,
        'weight_grams': 200,
        'variants': [
            {'variant_sku': 'MAT-003-CLEAR', 'color_name': 'Crystal Clear AB', 'stock_quantity': 100},
            {'variant_sku': 'MAT-003-GOLD', 'color_name': 'Gold', 'stock_quantity': 80},
            {'variant_sku': 'MAT-003-BLACK', 'color_name': 'Jet Black', 'stock_quantity': 60},
        ]
    },
    {
        'sku': 'MAT-004',
        'product_type': 'tailoring_material',
        'category': 'Stones & Beads',
        'name': 'Glass Seed & Bugle Beads Mix',
        'slug': 'glass-seed-bugle-beads-mix',
        'description': 'Lustrous non-tarnish glass beads for hand embroidery (250g pack).',
        'unit_label': 'pack',
        'retail_price_ngn': 4000.00,
        'wholesale_price_ngn': 3400.00,
        'wholesale_min_qty': 6,
        'weight_grams': 250,
        'variants': [
            {'variant_sku': 'MAT-004-GOLD', 'color_name': 'Gold', 'stock_quantity': 50},
            {'variant_sku': 'MAT-004-SILVER', 'color_name': 'Silver', 'stock_quantity': 50},
            {'variant_sku': 'MAT-004-CHAMP', 'color_name': 'Champagne', 'stock_quantity': 40},
            {'variant_sku': 'MAT-004-ROSE', 'color_name': 'Rose Gold', 'stock_quantity': 35},
        ]
    },
    {
        'sku': 'MAT-005',
        'product_type': 'tailoring_material',
        'category': 'Haberdashery',
        'name': 'Invisible Concealed Zippers (22-inch)',
        'slug': 'invisible-concealed-zippers-22-inch',
        'description': 'Durable nylon invisible dress zippers (bundle of 12).',
        'unit_label': 'dozen',
        'retail_price_ngn': 2400.00,
        'wholesale_price_ngn': 1900.00,
        'wholesale_min_qty': 5,
        'weight_grams': 300,
        'variants': [
            {'variant_sku': 'MAT-005-BLACK', 'color_name': 'Black', 'stock_quantity': 30},
            {'variant_sku': 'MAT-005-WHITE', 'color_name': 'White', 'stock_quantity': 30},
            {'variant_sku': 'MAT-005-MIXED', 'color_name': 'Assorted', 'stock_quantity': 20},
        ]
    },
    {
        'sku': 'MAT-006',
        'product_type': 'tailoring_material',
        'category': 'Haberdashery',
        'name': 'Heavy Paper Stay / Collar Gum Interface',
        'slug': 'heavy-paper-stay-collar-gum-interface',
        'description': 'Fusible woven/paper interfacing for structured necklines and corsets.',
        'unit_label': 'yard',
        'retail_price_ngn': 1200.00,
        'wholesale_price_ngn': 950.00,
        'wholesale_min_qty': 20,
        'weight_grams': 150,
        'variants': [
            {'variant_sku': 'MAT-006-WHITE', 'color_name': 'White', 'stock_quantity': 100},
            {'variant_sku': 'MAT-006-BLACK', 'color_name': 'Black', 'stock_quantity': 80},
        ]
    },
    {
        'sku': 'MAT-007',
        'product_type': 'tailoring_material',
        'category': 'Haberdashery',
        'name': 'Polyester Sewing Thread (Large Cone)',
        'slug': 'polyester-sewing-thread-large-cone',
        'description': 'High-tensile lockstitch sewing thread 4000 yards per cone. Full shade card colors stocked.',
        'unit_label': 'cone',
        'retail_price_ngn': 1500.00,
        'wholesale_price_ngn': 1200.00,
        'wholesale_min_qty': 12,
        'weight_grams': 400,
        'variants': [
            {'variant_sku': 'MAT-007-WHITE', 'color_name': 'White', 'stock_quantity': 50},
            {'variant_sku': 'MAT-007-BLACK', 'color_name': 'Black', 'stock_quantity': 50},
            {'variant_sku': 'MAT-007-MIXED', 'color_name': 'Assorted Colors', 'stock_quantity': 30},
        ]
    },
    {
        'sku': 'MAT-008',
        'product_type': 'tailoring_material',
        'category': 'Haberdashery',
        'name': 'Mersilene / Rigilene Corset Boning',
        'slug': 'mersilene-rigilene-corset-boning',
        'description': 'Sew-through polyester boning for structured bodices and corsets. 12mm width.',
        'unit_label': 'yard',
        'retail_price_ngn': 1000.00,
        'wholesale_price_ngn': 800.00,
        'wholesale_min_qty': 15,
        'weight_grams': 100,
        'variants': [
            {'variant_sku': 'MAT-008-WHITE', 'color_name': 'White', 'stock_quantity': 150},
            {'variant_sku': 'MAT-008-BLACK', 'color_name': 'Black', 'stock_quantity': 120},
        ]
    },
]

for item in products_data:
    variants = item.pop('variants')
    product, created = Product.objects.get_or_create(
        sku=item['sku'],
        defaults=item
    )
    if created:
        print(f"  ✓ Created product: {product.name}")
    else:
        print(f"  ~ Skipped (exists): {product.name}")

    for v in variants:
        variant, v_created = ProductVariant.objects.get_or_create(
            variant_sku=v['variant_sku'],
            defaults={**v, 'product': product}
        )
        if v_created:
            print(f"      + Variant: {variant.variant_sku}")

print("\nSeeding complete.")