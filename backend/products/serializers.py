
from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):

    effective_price_ngn = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'variant_sku',
            'size_label',
            'color_name',
            'color_hex',
            'stock_quantity',
            'price_override_ngn',
            'effective_price_ngn',
            'image_url',
            'in_stock',
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing products."""

    has_wholesale = serializers.ReadOnlyField()
    variant_count = serializers.SerializerMethodField()
    in_stock_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'sku',
            'product_type',
            'category',
            'name',
            'slug',
            'unit_label',
            'retail_price_ngn',
            'wholesale_price_ngn',
            'wholesale_min_qty',
            'has_wholesale',
            'weight_grams',
            'variant_count',
            'in_stock_count',
            'is_active',
        ]

    def get_variant_count(self, obj):
        return obj.variants.count()

    def get_in_stock_count(self, obj):
        return obj.variants.filter(stock_quantity__gt=0).count()


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer with all variants."""

    variants = ProductVariantSerializer(many=True, read_only=True)
    has_wholesale = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id',
            'sku',
            'product_type',
            'category',
            'name',
            'slug',
            'description',
            'unit_label',
            'retail_price_ngn',
            'wholesale_price_ngn',
            'wholesale_min_qty',
            'has_wholesale',
            'weight_grams',
            'is_active',
            'created_at',
            'updated_at',
            'variants',
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    """For admin creating/updating products."""

    class Meta:
        model = Product
        fields = [
            'sku',
            'product_type',
            'category',
            'name',
            'slug',
            'description',
            'unit_label',
            'retail_price_ngn',
            'wholesale_price_ngn',
            'wholesale_min_qty',
            'weight_grams',
            'is_active',
        ]