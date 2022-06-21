from django.contrib.auth import login, logout
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .serializers import LoginUserSerializer, RegisterUserSerializer, PostSerializer
from .models import Post
from .permissions import IsPostOwner

class RegisterUserAPIView(APIView):
    serializer_class = RegisterUserSerializer

    def post(self, request):
        data = request.data 
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUserAPIView(APIView):
    serializer_class = LoginUserSerializer

    def post(self, request):
        data = request.data 
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)

            return Response({"message": "user logged in successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors)


class LogoutAPIView(APIView):
    def get(self, request):
        logout(request)
        return Response({"message": "user logged out successfull"}, status=status.HTTP_200_OK)


class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_on') 
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(auther=self.request.user)


class PostRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated, IsPostOwner]
    





        
    


