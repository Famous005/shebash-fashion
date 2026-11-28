

from django.urls import path
from .views import (
    AdminBookingListView,
    AdminBookingUpdateView,
    AdminServiceCreateView,
    AdminServiceUpdateView,
    MyBookingsView,
    ServiceBookingCreateView,
    ServiceDetailView,
    ServiceListView,
)

urlpatterns = [
    # Public
    path('', ServiceListView.as_view(), name='service-list'),
    path('catalog/<str:service_code>/', ServiceDetailView.as_view(), name='service-detail'),
    # Customer (authenticated)
    path('book/', ServiceBookingCreateView.as_view(), name='service-book'),
    path('my-bookings/', MyBookingsView.as_view(), name='my-bookings'),
    # Admin
    path('admin/create/', AdminServiceCreateView.as_view(), name='admin-service-create'),
    path('admin/<int:pk>/', AdminServiceUpdateView.as_view(), name='admin-service-update'),
    path('admin/bookings/', AdminBookingListView.as_view(), name='admin-booking-list'),
    path('admin/bookings/<int:pk>/', AdminBookingUpdateView.as_view(), name='admin-booking-update'),
]