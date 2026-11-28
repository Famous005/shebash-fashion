from django.db import models
from django.conf import settings


class ServiceCatalog(models.Model):

    SERVICE_TYPE_CHOICES = [
        ('bespoke_sewing', 'Bespoke Sewing'),
        ('stoning', 'Stoning'),
        ('beadwork', 'Beadwork'),
    ]

    service_code = models.CharField(max_length=40, unique=True)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    name = models.CharField(max_length=180)
    description = models.TextField()
    base_price_ngn = models.DecimalField(max_digits=12, decimal_places=2)
    wholesale_price_ngn = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    wholesale_min_qty = models.IntegerField(null=True, blank=True)
    estimated_days = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'service_catalog'
        ordering = ['service_type', 'base_price_ngn']

    def __str__(self):
        return f'{self.name} ({self.service_code})'


class OrderServiceBooking(models.Model):

    FABRIC_SOURCE_CHOICES = [
        ('client_supplied_dropoff_or_waybill', 'Client Supplied (Drop-off or Waybill)'),
        ('purchased_from_store', 'Purchased from Store'),
    ]

    EMBELLISHMENT_CHOICES = [
        ('none', 'None'),
        ('neckline_only', 'Neckline Only'),
        ('neckline_and_sleeves', 'Neckline and Sleeves'),
        ('scattered_full_body', 'Scattered Full Body'),
        ('heavy_full_couture', 'Heavy Full Couture'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('ready', 'Ready'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='service_bookings'
    )
    service = models.ForeignKey(
        ServiceCatalog,
        on_delete=models.PROTECT,
        related_name='bookings'
    )
    measurement_snapshot = models.JSONField(null=True, blank=True)
    fabric_source = models.CharField(max_length=35, choices=FABRIC_SOURCE_CHOICES)
    embellishment_placement = models.CharField(
        max_length=25,
        choices=EMBELLISHMENT_CHOICES,
        default='none'
    )
    stone_or_bead_color = models.CharField(max_length=80, null=True, blank=True)
    reference_image_urls = models.JSONField(null=True, blank=True)
    agreed_price_ngn = models.DecimalField(max_digits=12, decimal_places=2)
    promised_delivery_date = models.DateField()
    special_instructions = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'order_service_bookings'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.full_name} — {self.service.name} ({self.created_at.date()})'