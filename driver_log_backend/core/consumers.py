import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Journey, LogEntry
from django.utils import timezone

class JourneyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.journey_id = self.scope['url_route']['kwargs']['journey_id']
        self.journey_group_name = f'journey_{self.journey_id}'

        # Join journey group
        await self.channel_layer.group_add(
            self.journey_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave journey group
        await self.channel_layer.group_discard(
            self.journey_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'location_update':
            await self.update_location(data)
        elif message_type == 'status_update':
            await self.update_status(data)
        elif message_type == 'log_entry':
            await self.create_log_entry(data)

    @database_sync_to_async
    def update_location(self, data):
        journey = Journey.objects.get(id=self.journey_id)
        journey.current_location = {
            'latitude': data['latitude'],
            'longitude': data['longitude']
        }
        journey.save()
        return journey

    async def journey_update(self, event):
        # Send journey update to WebSocket
        await self.send(text_data=json.dumps(event['data']))