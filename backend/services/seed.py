
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from services.models import ServiceCatalog

print("Seeding service catalog...")

ServiceCatalog.objects.all().delete()

services_data = [
    # --- BESPOKE SEWING ---
    {
        'service_code': 'SEW-001',
        'service_type': 'bespoke_sewing',
        'name': 'Simple Shift / A-Line Gown',
        'description': 'Custom-sewn knee or midi length gown with basic lining. Client provides fabric or selects from store.',
        'base_price_ngn': 12000.00,
        'wholesale_price_ngn': 10000.00,
        'wholesale_min_qty': 3,
        'estimated_days': 5,
    },
    {
        'service_code': 'SEW-002',
        'service_type': 'bespoke_sewing',
        'name': 'Aso-Ebi Lace Blouse & Wrapper',
        'description': 'Tailored padded blouse with double-wrapper or fitted skirt. Includes bustier padding and full cotton/satin lining.',
        'base_price_ngn': 25000.00,
        'wholesale_price_ngn': 22000.00,
        'wholesale_min_qty': 3,
        'estimated_days': 7,
    },
    {
        'service_code': 'SEW-003',
        'service_type': 'bespoke_sewing',
        'name': 'Ladies Kaftan / Bubu Gown',
        'description': 'Flowing luxury boubou or kaftan with pocket and neckline finishing. Ideal for silk crepe or adire fabrics.',
        'base_price_ngn': 15000.00,
        'wholesale_price_ngn': 13000.00,
        'wholesale_min_qty': 3,
        'estimated_days': 5,
    },
    {
        'service_code': 'SEW-004',
        'service_type': 'bespoke_sewing',
        'name': 'Corset Dinner / Reception Dress',
        'description': 'Structured boned corset gown with flared or mermaid hem. Requires accurate underbust and waist measurements.',
        'base_price_ngn': 45000.00,
        'wholesale_price_ngn': 40000.00,
        'wholesale_min_qty': 2,
        'estimated_days': 10,
    },
    {
        'service_code': 'SEW-005',
        'service_type': 'bespoke_sewing',
        'name': 'Bespoke Bridal / Engagement Gown',
        'description': 'Custom luxury bridal or traditional engagement outfit with intricate structure. Includes 2 fitting checks.',
        'base_price_ngn': 95000.00,
        'wholesale_price_ngn': None,
        'wholesale_min_qty': None,
        'estimated_days': 21,
    },
    # --- STONING ---
    {
        'service_code': 'STN-001',
        'service_type': 'stoning',
        'name': 'Neckline & Collar Stoning',
        'description': 'Heat-press crystal stoning concentrated around neckline and yoke. Available for newly sewn or client-supplied outfits.',
        'base_price_ngn': 5000.00,
        'wholesale_price_ngn': 4000.00,
        'wholesale_min_qty': 5,
        'estimated_days': 2,
    },
    {
        'service_code': 'STN-002',
        'service_type': 'stoning',
        'name': 'Neckline + Sleeves Stoning',
        'description': 'Crystal rhinestone detailing across neckline and both sleeves. Choice of silver AB or gold DMC stones.',
        'base_price_ngn': 9000.00,
        'wholesale_price_ngn': 7500.00,
        'wholesale_min_qty': 5,
        'estimated_days': 3,
    },
    {
        'service_code': 'STN-003',
        'service_type': 'stoning',
        'name': 'Scattered Full-Body Stoning',
        'description': 'Evenly spaced crystal stones across front and back of gown. Popular for lace and crepe boubou gowns.',
        'base_price_ngn': 15000.00,
        'wholesale_price_ngn': 12500.00,
        'wholesale_min_qty': 5,
        'estimated_days': 4,
    },
    {
        'service_code': 'STN-004',
        'service_type': 'stoning',
        'name': 'Heavy Bridal / Red-Carpet Stoning',
        'description': 'Dense multi-size crystal pattern work across bodice and hem. Uses premium DMC/Swarovski-grade hotfix crystals.',
        'base_price_ngn': 30000.00,
        'wholesale_price_ngn': 26000.00,
        'wholesale_min_qty': 3,
        'estimated_days': 6,
    },
    # --- BEADWORK ---
    {
        'service_code': 'BED-001',
        'service_type': 'beadwork',
        'name': 'Neckline & Sleeve Hand Beading',
        'description': 'Hand-stitched glass seed beads and pearls along neckline and cuffs. Custom color-matched to fabric.',
        'base_price_ngn': 10000.00,
        'wholesale_price_ngn': 8500.00,
        'wholesale_min_qty': 3,
        'estimated_days': 4,
    },
    {
        'service_code': 'BED-002',
        'service_type': 'beadwork',
        'name': '3D Applique & Fringe Beading',
        'description': 'Hand-sewn beaded lace appliques with dangling crystal/bead fringes. Ideal for aso-ebi sleeves and bodice.',
        'base_price_ngn': 22000.00,
        'wholesale_price_ngn': 19000.00,
        'wholesale_min_qty': 3,
        'estimated_days': 6,
    },
    {
        'service_code': 'BED-003',
        'service_type': 'beadwork',
        'name': 'Full Luxury Couture Beadwork',
        'description': 'Intricate full-bodice and skirt hand beading with pearls and bugle beads. Artisan handwork; price scales with bead density.',
        'base_price_ngn': 55000.00,
        'wholesale_price_ngn': 50000.00,
        'wholesale_min_qty': 2,
        'estimated_days': 12,
    },
]

for item in services_data:
    service, created = ServiceCatalog.objects.get_or_create(
        service_code=item['service_code'],
        defaults=item
    )
    if created:
        print(f"  ✓ Created: {service.name}")
    else:
        print(f"  ~ Skipped (exists): {service.name}")

print("\nSeeding complete.")