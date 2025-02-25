from django import forms
from .models import Driver, Trip

class DriverForm(forms.ModelForm):
    class Meta:
        model = Driver
        fields = ['name', 'email', 'phone']

class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ['driver', 'start_location', 'end_location', 'start_time', 'end_time', 'distance', 'duration']
