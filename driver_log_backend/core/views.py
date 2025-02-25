from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from datetime import datetime, timezone
from .models import Driver, Journey, LogEntry, RestStop
from .serializers import (
    DriverSerializer, JourneySerializer, JourneyCreateSerializer,
    LogEntrySerializer, RestStopSerializer
)

class DriverViewSet(viewsets.ModelViewSet):
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Driver.objects.all()
        return Driver.objects.filter(user=self.request.user)

class JourneyViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return JourneyCreateSerializer
        return JourneySerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Journey.objects.all()
        return Journey.objects.filter(driver__user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete_journey(self, request, pk=None):
        journey = self.get_object()
        if journey.status != 'IN_PROGRESS':
            return Response(
                {'error': 'Only in-progress journeys can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        journey.status = 'COMPLETED'
        journey.save()
        return Response(self.get_serializer(journey).data)

class LogEntryViewSet(viewsets.ModelViewSet):
    serializer_class = LogEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        journey_id = self.kwargs.get('journey_pk')
        if journey_id:
            if self.request.user.is_staff:
                return LogEntry.objects.filter(journey_id=journey_id)
            return LogEntry.objects.filter(
                journey_id=journey_id,
                journey__driver__user=self.request.user
            )
        return LogEntry.objects.none()

    def perform_create(self, serializer):
        journey = get_object_or_404(
            Journey,
            id=self.kwargs.get('journey_pk'),
            driver__user=self.request.user
        )
        serializer.save(journey=journey)

class RestStopViewSet(viewsets.ModelViewSet):
    serializer_class = RestStopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        journey_id = self.kwargs.get('journey_pk')
        if journey_id:
            if self.request.user.is_staff:
                return RestStop.objects.filter(journey_id=journey_id)
            return RestStop.objects.filter(
                journey_id=journey_id,
                journey__driver__user=self.request.user
            )
        return RestStop.objects.none()

    def perform_create(self, serializer):
        journey = get_object_or_404(
            Journey,
            id=self.kwargs.get('journey_pk'),
            driver__user=self.request.user
        )
        serializer.save(journey=journey)
class DriverProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        driver = get_object_or_404(Driver, user=request.user)
        serializer = DriverSerializer(driver)
        return Response(serializer.data)

    def patch(self, request):
        driver = get_object_or_404(Driver, user=request.user)
        serializer = DriverSerializer(driver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompleteJourneyView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, journey_id):
        journey = get_object_or_404(
            Journey,
            id=journey_id,
            driver__user=request.user
        )
        
        if journey.status == 'COMPLETED':
            return Response(
                {'error': 'Journey is already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        journey.status = 'COMPLETED'
        journey.end_time = datetime.now(timezone.utc)
        journey.save()
        
        serializer = JourneySerializer(journey)
        return Response(serializer.data)

class JourneySummaryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, journey_id):
        journey = get_object_or_404(
            Journey,
            id=journey_id,
            driver__user=request.user
        )
        
        log_entries = LogEntry.objects.filter(journey=journey)
        rest_stops = RestStop.objects.filter(journey=journey)
        
        total_drive_time = sum(
            (entry.end_time - entry.start_time).total_seconds() / 3600
            for entry in log_entries
            if entry.activity_type == 'DRIVING' and entry.end_time
        )
        
        return Response({
            'journey_id': journey.id,
            'status': journey.status,
            'total_distance': journey.total_distance,
            'total_drive_time': round(total_drive_time, 2),
            'log_entries_count': log_entries.count(),
            'rest_stops_count': rest_stops.count(),
            'start_time': journey.start_time,
            'end_time': journey.end_time,
        })        