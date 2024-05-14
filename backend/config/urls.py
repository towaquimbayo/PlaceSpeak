"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pages.views import UpdateEmailVerificationStatus, UpdatePhoneVerificationStatus, UpdateAddressVerificationStatus, PopulateBadges, VerifyTrustedNeighbourBadge
from pages.views import UserAPI, UpdateUserAPI, UserAchievementAPI, LoginUserAPI, RegisterUserAPI

urlpatterns = [
    path("admin/", admin.site.urls),
    # path("hello/", views.HelloWorldView.as_view()),

    # Verification endpoints
    path('api/users/<str:user_id>/update-email-verification/', UpdateEmailVerificationStatus.as_view(), name='update_email_verification'),
    path('api/users/<str:user_id>/update-phone-verification/', UpdatePhoneVerificationStatus.as_view(), name='update_phone_verification'),
    path('api/users/<str:user_id>/update-address-verification/', UpdateAddressVerificationStatus.as_view(), name='update_address_verification'),

    # Population endpoints
    path('api/populate/badges/', PopulateBadges.as_view(), name='populate_badges'),

    # Badge check/unlock endpoints
    path('api/<str:user_id>/verify-trusted-neighbour/', VerifyTrustedNeighbourBadge.as_view(), name='verify_trusted_neighbour'),

    # User endpoints
	path('api/users', UserAPI.as_view()),
	path('api/update_user', UpdateUserAPI.as_view()),
	path('api/users/achievement', UserAchievementAPI.as_view()),

    # Auth endpoints
    path('api/user/login', LoginUserAPI.as_view()),
    path('api/user/register', RegisterUserAPI.as_view()),
]
