from django.urls import path
from . import views

app_name = 'social'

urlpatterns = [
    path('auth/register/', views.RegisterUserAPIView.as_view(), name="register"),
    path('auth/login/', views.LoginUserAPIView.as_view(), name="login"),
    path('auth/logout/', views.LogoutAPIView.as_view(), name="logout"),
    path('posts/', views.PostListCreateAPIView.as_view(), name="post-list-create"),
    path('posts/<int:pk>/', views.PostRetrieveUpdateDestroyAPIView.as_view(), name="post-retrieve-update-delete"),
    path('profiles/', views.UserProfileListAPIView.as_view(), name='profiles'),
    path('profile/<int:pk>/', views.UserProfileRetrieveUpdateAPIView.as_view(), name='profile-retrieve-update'),
    path('profile/<int:pk>/follow/', views.AddFollowerAPIView.as_view(), name="follow"),
    path('profile/<int:pk>/unfollow/', views.RemoveFollowerAPIView.as_view(), name="unfollow"),
    path('profile/getme/', views.GetOwnProfileAPIView.as_view(), name='my-profile'),
    path('post/<int:pk>/like/', views.AddLikeAPIView.as_view(), name='like'),
    path('post/<int:pk>/comment/', views.CommentCreateAPIView.as_view(), name="create-comment"),
    path('comments/', views.AllComments.as_view(), name="all-comment"),
    path('comment/<int:pk>/delete/', views.CommentDeleteAPIView.as_view(), name="delete-comment"),
    path('comment/<int:pk>/like/', views.CommentAddLikeAPIView.as_view(), name="like-comment"),
    path('post/<int:post_pk>/comment/<int:comment_pk>/reply-comment/', views.CommentReplyAPIView.as_view(), name="reply-comment"),
    path('post/<int:post_pk>/comment/<int:comment_pk>/all-sub-comments/', views.CommentReplyAllListAPIView.as_view(), name="all-sub-comment"),
    path('forgot-password/', views.PasswordResetEmailAPIView.as_view(), name="forget-password"),
    path('auth/reset-password/<str:uid>/<str:token>/', views.ResetPasswordTokenValidatorAPIView.as_view(), name="reset-token-validator"),
    path('reset-password/set-new-password/', views.SetNewPasswordAPIView.as_view(), name="set-new-password"),
]


# {
# "uid": "MjM",
# "token": "b82jr2-60204a9dc38a9e3b6cc6c0309edf714e",
# "password": "12345678",
# "confirm_password": "12345678"
# }