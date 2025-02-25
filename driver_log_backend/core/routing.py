from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/journey/(?P<journey_id>\w+)/$', consumers.JourneyConsumer.as_asgi()),
]