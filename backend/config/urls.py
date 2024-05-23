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
from pages.views import AddComment, AllBadgesAPI, GetCommentsByPost, GetPostsByUser, UpdateEmailVerificationStatus, UpdatePhoneVerificationStatus, UpdateAddressVerificationStatus, PopulateBadges, UserAddressAPI, UserBadgesAPI, UserPrimaryAddressAPI
from pages.views import UserAPI, UpdateUserAPI, UserAchievementAPI, LoginUserAPI, RegisterUserAPI, AddPost, GetAllPosts, VoteInPoll, InviteNeighbor, AgeAccount
from pages.views import VerifyInsightfulBadge, VerifyLegacyCitizenBadge, VerifyNewNeighborBadge, VerifyNewVoiceBadge, VerifyTrustedNeighbourBadge, VerifyWelcomingWhispererBadge
from pages.views import UpvotePost, DownvotePost, UpvoteComment, DownvoteComment

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
    path('api/<str:user_id>/verify-new-voice/', VerifyNewVoiceBadge.as_view(), name='verify_new_voice'),
    path('api/<str:user_id>/verify-legacy-citizen/', VerifyLegacyCitizenBadge.as_view(), name='verify_legacy_citizen'),
    path('api/<str:user_id>/verify-new-neighbor/', VerifyNewNeighborBadge.as_view(), name='verify_new_neighbor'),
    path('api/<str:user_id>/verify-welcoming-whisperer/', VerifyWelcomingWhispererBadge.as_view(), name='verify_welcoming_whisperer'),
    path('api/<str:user_id>/verify-insightful/', VerifyInsightfulBadge.as_view(), name='verify_insightful'),

    # User endpoints
	path('api/users', UserAPI.as_view()),
	path('api/update_user', UpdateUserAPI.as_view()),
	path('api/users/achievement', UserAchievementAPI.as_view()),
	path('api/users/primaryAddress', UserPrimaryAddressAPI.as_view()),
	path('api/users/badges/<str:user_id>', UserBadgesAPI.as_view()),

    # Auth endpoints
    path('api/user/login', LoginUserAPI.as_view()),
    path('api/user/register', RegisterUserAPI.as_view()),
		
    # badges endpoints
    path('api/badges', AllBadgesAPI.as_view()),

    # Post endpoints
    path('api/posts/add', AddPost.as_view(), name='add_post'),
    path('api/posts/upvote', UpvotePost.as_view(), name='upvote_post'),
    path('api/posts/downvote', DownvotePost.as_view(), name='downvote_post'),
    path('api/posts', GetAllPosts.as_view(), name='get_all_posts'),
    path('api/posts/<str:user_id>', GetPostsByUser.as_view(), name='get_posts_by_user'),

    # Comment endpoints
    path('api/comments/add', AddComment.as_view(), name='add_comment'),
    path('api/comments/upvote', UpvoteComment.as_view(), name='upvote_comment'),
    path('api/comments/downvote', DownvoteComment.as_view(), name='downvote_comment'),
    path('api/comments/<str:post_id>', GetCommentsByPost.as_view(), name='get_comments_by_post'),
		
    # Address endpoints
	path('api/users/address/<str:user_id>', UserAddressAPI.as_view()),
  
    # Extra endpoints (mock APIs)
    path('api/poll', VoteInPoll.as_view(), name='vote_in_poll'),
    path('api/invite', InviteNeighbor.as_view(), name='invite_neighbor'),
    path('api/age-account', AgeAccount.as_view(), name='age_account'),
]
