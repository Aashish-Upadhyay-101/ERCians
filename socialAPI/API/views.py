from django.contrib.auth import login, logout
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import permission_classes
from .serializers import LoginUserSerializer, RegisterUserSerializer, PostSerializer, UserProfileSerializer, CommentSerializer
from .models import Post, UserProfile, Comment
from .permissions import IsPostOwner, IsOriginalUser, IsCommentOwner


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

@permission_classes([IsAuthenticated])
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


class AddLikeAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            post = Post.objects.get(pk=pk)
        except:
            return Response({"message": "post not found !"}, status=status.HTTP_404_NOT_FOUND)
        
        is_liked = False 
        if request.user in post.likes.all():
            is_liked = True 
        
        if is_liked:
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)

        post_serializer = PostSerializer(post).data

        return Response({"message": "done!", "post": post_serializer}, status=status.HTTP_200_OK)
        
    

class UserProfileListAPIView(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer


class UserProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    lookup_field = 'pk'
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOriginalUser]


class GetOwnProfileAPIView(APIView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user.profile
            serializer = UserProfileSerializer(user, many=False)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Please login to view your profile"}, status=status.HTTP_400_BAD_REQUEST)

    
class AddFollowerAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            user_profile = UserProfile.objects.get(pk=pk)
            if user_profile.user == request.user:
                return Response({"message": "User can't follow themself"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user_profile.followers.add(request.user)
        request.user.profile.followings.add(user_profile.user)
        
        if request.user in user_profile.followers.all():
            return Response({"message": "You followed the user !"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is problem following the user please try again later"}, status=status.HTTP_400_BAD_REQUEST)



class RemoveFollowerAPIView(APIView):
    def get (self, request, pk, *args, **kwargs):
        try:
            user_profile = UserProfile.objects.get(pk=pk)
            if user_profile.user == request.user:
                return Response({"message": "User can't unfollow themself"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

        user_profile.followers.remove(request.user)
        request.user.profile.followings.remove(user_profile.user)

        if request.user not in user_profile.followers.all():
            return Response({"message": "You unfollowed the user !"}, status=status.HTTP_200_OK)
        else: 
            return Response({"message": "There is problem unfollowing the user please try again later"}, status=status.HTTP_400_BAD_REQUEST)


class CommentCreateAPIView(APIView):
    def post(self, request, pk, *args, **kwargs):
        post = Post.objects.get(pk=pk)
        user = request.user
        
        data = {
            "user": user.pk,
            "post": post.pk,
            "comment": request.data.get('comment'),
        }

        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "You commented on the post", "data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CommentDeleteAPIView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated, IsCommentOwner]


class AllComments(APIView):
    def get(self, request, *args, **kwargs):
        comments = Comment.objects.all().order_by('-created_on')
        serializer = CommentSerializer(comments, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


class CommentAddLikeAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            comment = Comment.objects.get(pk=pk)
        except:
            return Response({"message": "Comment no longer exists"}, status=status.HTTP_404_NOT_FOUND)
        
        is_liked = False
        if request.user in comment.likes.all():
            is_liked = True 

        if is_liked:
            comment.likes.remove(request.user)
        else:
            comment.likes.add(request.user)

        serializer = CommentSerializer(comment)
        return Response({"message": "done!", "data": serializer.data}, status=status.HTTP_200_OK)



class CommentReplyAPIView(APIView):
    def post(self, request, post_pk, comment_pk, *args, **kwargs):
        try:
            post = Post.objects.get(pk=post_pk)
            comment = Comment.objects.get(pk=comment_pk)
        except:
            return Response({"message": "The post or comment no longer exist"}, status=status.HTTP_400_BAD_REQUEST)

        if comment.post.id != post.id:
            print('comment', comment.post.id)
            print('post', post.id)
            return Response({"message": "The post or comment no longer exist"}, status=status.HTTP_400_BAD_REQUEST)

        
        data = {
            'user': request.user.pk,
            'post': post.pk,
            'sub_comment': comment.pk,
            'comment': request.data.get('comment')
        }

        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CommentReplyAllListAPIView(APIView):
    def get(self, request, post_pk, comment_pk, *args, **kwargs):
        try:
            post = Post.objects.get(pk=post_pk)
            comment = Comment.objects.get(pk=comment_pk)
        except:
            return Response({"message": "The post or comment no longer exist"}, status=status.HTTP_400_BAD_REQUEST)

        if comment.post.id != post.id:
            print('comment', comment.post.id)
            print('post', post.id)
            return Response({"message": "The post or comment no longer exist"}, status=status.HTTP_400_BAD_REQUEST)
 
        '''
        display all the sub-comment of that comment_pk (logic goes here)
        '''
        all_sub_comment = comment.all_sub_comments()
        serializer = CommentSerializer(all_sub_comment, many=True)
        return Response({"data": serializer.data})

"""
comment reply and comment like (display user's info who liked the post -> optional)
check sub_comment delele end point
API endpoint testing all results
"""

