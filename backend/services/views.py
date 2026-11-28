

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ServiceCatalog, OrderServiceBooking
from .serializers import (
    AdminServiceCatalogWriteSerializer,
    ServiceBookingCreateSerializer,
    ServiceBookingDetailSerializer,
    ServiceCatalogSerializer,
)


class ServiceListView(APIView):
    """
    GET /api/services/ — List all active services.
    Supports filtering by ?type=bespoke_sewing|stoning|beadwork
    """
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = ServiceCatalog.objects.filter(is_active=True)

        service_type = request.query_params.get('type')
        if service_type:
            queryset = queryset.filter(service_type=service_type)

        serializer = ServiceCatalogSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data,
        })


class ServiceDetailView(APIView):
    """GET /api/services/<service_code>/ — Single service detail."""
    permission_classes = [AllowAny]

    def get(self, request, service_code):
        try:
            service = ServiceCatalog.objects.get(
                service_code=service_code, is_active=True
            )
        except ServiceCatalog.DoesNotExist:
            return Response(
                {'error': 'Service not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ServiceCatalogSerializer(service)
        return Response(serializer.data)


class ServiceBookingCreateView(APIView):
    """POST /api/services/book/ — Customer creates a service booking."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ServiceBookingCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            booking = serializer.save()
            return Response(
                ServiceBookingDetailSerializer(booking).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyBookingsView(APIView):
    """GET /api/services/my-bookings/ — Customer views their own bookings."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = OrderServiceBooking.objects.filter(
            user=request.user
        ).select_related('service')
        serializer = ServiceBookingDetailSerializer(bookings, many=True)
        return Response({
            'count': bookings.count(),
            'results': serializer.data,
        })


class AdminServiceCreateView(APIView):
    """POST /api/services/admin/create/ — Admin adds a new service."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ['admin', 'tailor_staff']:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = AdminServiceCatalogWriteSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response(
                ServiceCatalogSerializer(service).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminServiceUpdateView(APIView):
    """PATCH /api/services/admin/<id>/ — Admin updates a service."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role not in ['admin', 'tailor_staff']:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            service = ServiceCatalog.objects.get(pk=pk)
        except ServiceCatalog.DoesNotExist:
            return Response(
                {'error': 'Service not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminServiceCatalogWriteSerializer(
            service, data=request.data, partial=True
        )
        if serializer.is_valid():
            service = serializer.save()
            return Response(ServiceCatalogSerializer(service).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminBookingListView(APIView):
    """GET /api/services/admin/bookings/ — Admin views all bookings."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'tailor_staff']:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        bookings = OrderServiceBooking.objects.select_related(
            'service', 'user'
        ).all()

        # Filter by status if provided
        booking_status = request.query_params.get('status')
        if booking_status:
            bookings = bookings.filter(status=booking_status)

        serializer = ServiceBookingDetailSerializer(bookings, many=True)
        return Response({
            'count': bookings.count(),
            'results': serializer.data,
        })


class AdminBookingUpdateView(APIView):
    """PATCH /api/services/admin/bookings/<id>/ — Admin updates booking status."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role not in ['admin', 'tailor_staff']:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            booking = OrderServiceBooking.objects.get(pk=pk)
        except OrderServiceBooking.DoesNotExist:
            return Response(
                {'error': 'Booking not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        # Admin can update status and agreed price
        allowed_fields = ['status', 'agreed_price_ngn', 'promised_delivery_date']
        data = {k: v for k, v in request.data.items() if k in allowed_fields}
        for field, value in data.items():
            setattr(booking, field, value)
        booking.save()
        return Response(ServiceBookingDetailSerializer(booking).data)