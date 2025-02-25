from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Location(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.latitude}, {self.longitude}"
class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    license_number = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.license_number}"

class Journey(models.Model):
    STATUS_CHOICES = [
        ('PLANNED', 'Planned'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='journeys')
    start_location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name='journeys_starting'
    )
    end_location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name='journeys_ending'
    )
    route_data = models.JSONField(null=True, blank=True)  # Store route coordinates

    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNED')
    total_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.driver} - {self.start_location} to {self.end_location}"

class LogEntry(models.Model):
    ACTIVITY_CHOICES = [
        ('DRIVING', 'Driving'),
        ('ON_DUTY', 'On Duty Not Driving'),
        ('OFF_DUTY', 'Off Duty'),
        ('SLEEPER', 'Sleeper Berth'),
    ]

    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='log_entries')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_CHOICES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    odometer_reading = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.journey.driver} - {self.activity_type} at {self.location}"

class RestStop(models.Model):
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='rest_stops')
    location = models.ForeignKey(Location, on_delete=models.PROTECT)
    planned_arrival = models.DateTimeField()
    actual_arrival = models.DateTimeField(null=True, blank=True)
    planned_duration = models.PositiveIntegerField(help_text="Duration in minutes")
    actual_duration = models.PositiveIntegerField(null=True, blank=True, help_text="Duration in minutes")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.journey.driver} - Rest at {self.location}"