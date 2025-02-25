from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

# Create main router
router = DefaultRouter()
router.register(r'drivers', views.DriverViewSet, basename='driver')
router.register(r'journeys', views.JourneyViewSet, basename='journey')

# Create nested routers for journey-related endpoints
journey_router = routers.NestedSimpleRouter(router, r'journeys', lookup='journey')
journey_router.register(r'log-entries', views.LogEntryViewSet, basename='journey-log-entries')
journey_router.register(r'rest-stops', views.RestStopViewSet, basename='journey-rest-stops')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(journey_router.urls)),
]