

from django.urls import path
from .views import (
    AdminProductCreateView,
    AdminProductUpdateView,
    AdminVariantCreateView,
    ProductCategoryListView,
    ProductDetailView,
    ProductListView,
)

urlpatterns = [
    # Public endpoints
    path('', ProductListView.as_view(), name='product-list'),
    path('categories/', ProductCategoryListView.as_view(), name='product-categories'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    # Admin endpoints
    path('admin/create/', AdminProductCreateView.as_view(), name='admin-product-create'),
    path('admin/<int:pk>/', AdminProductUpdateView.as_view(), name='admin-product-update'),
    path('admin/<int:pk>/variants/', AdminVariantCreateView.as_view(), name='admin-variant-create'),
]