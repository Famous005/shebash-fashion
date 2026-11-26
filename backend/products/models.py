
from django.db import models


class Product(models.Model):

    PRODUCT_TYPE_CHOICES = [
        ('ready_to_wear', 'Ready to Wear'),
        ('tailoring_material', 'Tailoring Material'),
    ]

    sku = models.CharField(max_length=64, unique=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    unit_label = models.CharField(max_length=30, default='piece')
    retail_price_ngn = models.DecimalField(max_digits=12, decimal_places=2)
    wholesale_price_ngn = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    wholesale_min_qty = models.IntegerField(null=True, blank=True)
    weight_grams = models.IntegerField(default=500)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['category', 'name']

    def __str__(self):
        return f'{self.name} ({self.sku})'

    @property
    def has_wholesale(self):
        return self.wholesale_price_ngn is not None

    def get_price(self, quantity=1):
        """Return correct price based on quantity."""
        if (
            self.has_wholesale
            and self.wholesale_min_qty
            and quantity >= self.wholesale_min_qty
        ):
            return self.wholesale_price_ngn
        return self.retail_price_ngn


class ProductVariant(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )
    variant_sku = models.CharField(max_length=80, unique=True)
    size_label = models.CharField(max_length=40, null=True, blank=True)
    color_name = models.CharField(max_length=60, null=True, blank=True)
    color_hex = models.CharField(max_length=7, null=True, blank=True)
    stock_quantity = models.IntegerField(default=0)
    price_override_ngn = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    image_url = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'product_variants'
        ordering = ['size_label', 'color_name']

    def __str__(self):
        return f'{self.product.name} — {self.variant_sku}'

    @property
    def effective_price_ngn(self):
        """Variant price overrides product price if set."""
        return self.price_override_ngn or self.product.retail_price_ngn

    @property
    def in_stock(self):
        return self.stock_quantity > 0