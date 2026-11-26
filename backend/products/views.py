
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, ProductVariant
from .serializers import (
    ProductDetailSerializer,
    ProductListSerializer,
    ProductVariantSerializer,
    ProductWriteSerializer,
)


class ProductListView(APIView):
    """
    GET /api/products/ — List all active products.
    Supports filtering by: ?type=ready_to_wear|tailoring_material
                           ?category=Fabrics
                           ?search=stone
    """
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Product.objects.filter(is_active=True).prefetch_related('variants')

        # Filter by product type
        product_type = request.query_params.get('type')
        if product_type:
            queryset = queryset.filter(product_type=product_type)

        # Filter by category
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__icontains=category)

        # Search by name or description
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)

        serializer = ProductListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data,
        })


class ProductDetailView(APIView):
    """GET /api/products/<slug>/ — Single product with all variants."""
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            product = Product.objects.prefetch_related('variants').get(
                slug=slug, is_active=True
            )
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)


class ProductCategoryListView(APIView):
    """GET /api/products/categories/ — All distinct categories."""
    permission_classes = [AllowAny]

    def get(self, request):
        product_type = request.query_params.get('type')
        queryset = Product.objects.filter(is_active=True)
        if product_type:
            queryset = queryset.filter(product_type=product_type)

        categories = (
            queryset.values_list('category', flat=True)
            .distinct()
            .order_by('category')
        )
        return Response({'categories': list(categories)})


class AdminProductCreateView(APIView):
    """POST /api/products/admin/create/ — Admin creates a product."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ['admin', 'tailor_staff']:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = ProductWriteSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            return Response(
                ProductDetailSerializer(product).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminProductUpdateView(APIView):
    """PATCH /api/products/admin/<id>/ — Admin updates a product."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role not in ['admin', 'tailor_staff']:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ProductWriteSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            product = serializer.save()
            return Response(ProductDetailSerializer(product).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminVariantCreateView(APIView):
    """POST /api/products/admin/<id>/variants/ — Add variant to product."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role not in ['admin', 'tailor_staff']:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        data = request.data.copy()
        data['product'] = product.id
        serializer = ProductVariantSerializer(data=data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)