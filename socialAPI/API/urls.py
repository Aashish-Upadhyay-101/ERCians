from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterUserAPIView.as_view(), name="register"),
    path('auth/login/', views.LoginUserAPIView.as_view(), name="login"),
    path('auth/logout/', views.LogoutAPIView.as_view(), name="logout"),
    path('posts/', views.PostListCreateAPIView.as_view(), name="post-list-create"),
    path('posts/<int:pk>/', views.PostRetrieveUpdateDestroyAPIView.as_view(), name="post-retrieve-update-delete"),
]

