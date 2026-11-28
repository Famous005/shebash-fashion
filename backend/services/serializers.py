

from rest_framework import serializers
from .models import ServiceCatalog, OrderServiceBooking


class ServiceCatalogSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceCatalog
        fields = [
            'id',
            'service_code',
            'service_type',
            'name',
            'description',
            'base_price_ngn',
            'wholesale_price_ngn',
            'wholesale_min_qty',
            'estimated_days',
            'is_active',
        ]


class ServiceBookingCreateSerializer(serializers.ModelSerializer):
    """Used when a customer creates a booking."""

    class Meta:
        model = OrderServiceBooking
        fields = [
            'service',
            'measurement_snapshot',
            'fabric_source',
            'embellishment_placement',
            'stone_or_bead_color',
            'reference_image_urls',
            'special_instructions',
            'promised_delivery_date',
        ]

    def validate_service(self, value):
        if not value.is_active:
            raise serializers.ValidationError(
                'This service is currently unavailable.'
            )
        return value

    def create(self, validated_data):
        service = validated_data['service']

        # Calculate agreed price from service base price
        agreed_price = service.base_price_ngn

        booking = OrderServiceBooking.objects.create(
            **validated_data,
            agreed_price_ngn=agreed_price,
            user=self.context['request'].user,
        )
        return booking


class ServiceBookingDetailSerializer(serializers.ModelSerializer):
    """Full booking detail including service info."""

    service = ServiceCatalogSerializer(read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = OrderServiceBooking
        fields = [
            'id',
            'user_name',
            'user_email',
            'service',
            'measurement_snapshot',
            'fabric_source',
            'embellishment_placement',
            'stone_or_bead_color',
            'reference_image_urls',
            'agreed_price_ngn',
            'promised_delivery_date',
            'special_instructions',
            'status',
            'created_at',
            'updated_at',
        ]


class AdminServiceCatalogWriteSerializer(serializers.ModelSerializer):
    """Admin creates or updates a service."""

    class Meta:
        model = ServiceCatalog
        fields = [
            'service_code',
            'service_type',
            'name',
            'description',
            'base_price_ngn',
            'wholesale_price_ngn',
            'wholesale_min_qty',
            'estimated_days',
            'is_active',
        ]