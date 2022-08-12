from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .serializers import (LoginUserSerializer, RegisterUserSerializer, PostSerializer, UserProfileSerializer, CommentSerializer, SetNewPasswordSerializer, UpdateUserPasswordSerializer)
from .models import Post, UserProfile, Comment
from .permissions import IsPostOwner, IsCommentOwner


class RegisterUserAPIView(APIView):
    serializer_class = RegisterUserSerializer

    def post(self, request):
        data = request.data 
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# created a login token that is passed on the Response
class LoginUserAPIView(APIView):
    serializer_class = LoginUserSerializer

    def post(self, request):
        data = request.data 
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)

            token, created = Token.objects.get_or_create(user=user)
            return Response({"message": "user logged in successfully", "token": token.key, "user": user.id}, status=status.HTTP_200_OK)

        return Response(serializer.errors)
        # return Response("Invalid username or password")

class DefaultLoginAPIView(APIView):
    def get(self, request, token, *args, **kwargs):
        user = Token.objects.get(key=token).user
        login(request, user)
        serializer = UserProfileSerializer(user.profile, many=False)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)



class LogoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response({"message": "user logged out successfull"}, status=status.HTTP_200_OK)



class PostListCreateAPIView(generics.ListCreateAPIView):
    # queryset = Post.objects.all().order_by('-created_on') 
    serializer_class = PostSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Post.objects.all().order_by('-created_on')
    
    
    def perform_create(self, serializer):
        serializer.save(auther=self.request.user)


class PostRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated, IsPostOwner]


class AddLikeAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
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


class UserProfileRetrieveAPIView(generics.RetrieveUpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = UserProfile.objects.all()
    lookup_field = 'pk'
    serializer_class = UserProfileSerializer


class UserProfileUpdateAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        user_profile = UserProfile.objects.get(pk=pk)
        print(user_profile.email)
        return


class GetOwnProfileAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user.profile
        serializer = UserProfileSerializer(user, many=False)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


    
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


class CommentGetOneAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        comment = Comment.objects.get(pk=pk)
        serializer = CommentSerializer(comment).data 
        return Response({'data': serializer}, status=status.HTTP_200_OK)


class CommentCreateAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsCommentOwner]



class AllComments(APIView):
    def get(self, request, *args, **kwargs):
        comments = Comment.objects.all().order_by('-created_on')
        serializer = CommentSerializer(comments, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


class CommentAddLikeAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, post_pk, comment_pk, *args, **kwargs):
        try:
            post = Post.objects.get(pk=post_pk)
            comment = Comment.objects.get(pk=comment_pk)
        except:
            return Response({"message": "The post or comment no longer exist"}, status=status.HTTP_400_BAD_REQUEST)

        if comment.post.id != post.id:
            # print('comment', comment.post.id)
            # print('post', post.id)
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
        all_sub_comment = comment.all_sub_comments
        serializer = CommentSerializer(all_sub_comment, many=True)
        return Response({"data": serializer.data})


class PasswordResetEmailAPIView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            user_id_in_byte = str(user.id).encode()
            uid = urlsafe_base64_encode(user_id_in_byte)
            token = PasswordResetTokenGenerator().make_token(user)
            password_reset_url = f'http://127.0.0.1:8000/api/auth/reset-password/{uid}/{token}/'
            
            # email 
            subject = 'Password Reset For ERCians'
            email_body = f'Hello, \nuse this link to reset your password.\n{password_reset_url}'
            to = [email]
            email_from = settings.EMAIL_HOST_USER
            
            try:
                send_mail(subject, email_body, email_from, to)
                return Response({"message": "email sent successfully"})

            except Exception as e:
                print(e)
                
        return Response({"message": "There was problem sending email please try again."})


class ResetPasswordTokenValidatorAPIView(APIView):
    def get(self, request, uid, token, *args, **kwargs):
        try:
            user_id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            if user is None:
                return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({"message": "Token is invalid, please request another one"}, status=status.HTTP_401_UNAUTHORIZED)
            
            return Response({"message": "Credentials Valid", "uid": uid, "token": token}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": "Token is invalid, please request another one"}, status=status.HTTP_401_UNAUTHORIZED) 


class SetNewPasswordAPIView(APIView):    
    def patch(self, request, *args, **kwargs):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "password reset successfully"}, status=status.HTTP_200_OK)


# this is working fine now
class UpdateUserPasswordAPIView(APIView):
    def post(self, request, pk, *args, **kwargs):
        print(request.data)
        user = UserProfile.objects.get(pk=pk).user
        serializer = UpdateUserPasswordSerializer(data=request.data, context={'user': user})
        if serializer.is_valid(raise_exception=True):
            print("hello")
            return Response({"message": "new password is set"})

        return Response({"error": "There was error setting new password"})


