from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Driver, Journey, LogEntry, RestStop,Location

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')

class DriverSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Driver
        fields = ('id', 'user', 'license_number', 'phone_number', 'created_at', 'updated_at')

class RestStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestStop
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class JourneySerializer(serializers.ModelSerializer):
    log_entries = LogEntrySerializer(many=True, read_only=True)
    rest_stops = RestStopSerializer(many=True, read_only=True)
    driver = DriverSerializer(read_only=True)

    class Meta:
        model = Journey
        fields = (
            'id', 'driver', 'start_location', 'end_location',
            'start_time', 'end_time', 'status', 'total_distance',
            'log_entries', 'rest_stops', 'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')

class JourneyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = ('start_location', 'end_location', 'start_time')

    def create(self, validated_data):
        driver = Driver.objects.get(user=self.context['request'].user)
        return Journey.objects.create(driver=driver, **validated_data)
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'latitude', 'longitude', 'address')

class JourneyCreateSerializer(serializers.ModelSerializer):
    start_location = LocationSerializer()
    end_location = LocationSerializer()

    class Meta:
        model = Journey
        fields = ('start_location', 'end_location', 'start_time')

    def create(self, validated_data):
        start_location_data = validated_data.pop('start_location')
        end_location_data = validated_data.pop('end_location')
        
        start_location = Location.objects.create(**start_location_data)
        end_location = Location.objects.create(**end_location_data)
        
        journey = Journey.objects.create(
            start_location=start_location,
            end_location=end_location,
            **validated_data
        )
        
        return journey    