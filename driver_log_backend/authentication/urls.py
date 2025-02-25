from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views

urlpatterns = [
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Custom auth endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]