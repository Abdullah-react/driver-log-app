from django.db import models

class Driver(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

class Trip(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='trips')
    start_location = models.CharField(max_length=200)
    end_location = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    distance = models.FloatField()
    duration = models.DurationField()
