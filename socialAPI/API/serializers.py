from pydoc import locate
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str
from rest_framework import serializers
from .models import Post, UserProfile, Comment



class RegisterUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password']
        email = validated_data['email']

        user = User(username=username, email=email)
        user.set_password(password)
        user.save()
        return user

    def validate(self, validated_data):
        username_exist = User.objects.filter(username=validated_data['username']).exists()
        if username_exist:
            raise serializers.ValidationError("Username already exists!")

        email_exist = User.objects.filter(email=validated_data['email']).exists()
        if email_exist:
            raise serializers.ValidationError("Eamil already exists!")

        return super().validate(validated_data)
        

class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(min_length=8, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['email', 'password']

    def validate(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']

        if email and password:
            user_exists = User.objects.filter(email=email).exists()
            if user_exists:
                username = User.objects.filter(email=email).first().username
                user = authenticate(username=username, password=password)

                if not user:
                    raise serializers.ValidationError("username or password didn't match")
            else:
                raise serializers.ValidationError("user with that email doesn't exists")
        else:
            raise serializers.ValidationError("enter both username and password")

        validated_data['user'] = user
        return validated_data


class PostSerializer(serializers.ModelSerializer):
    auther = serializers.DictField(child=serializers.CharField(), source='get_user', read_only=True)
    likes = serializers.ListField(child=serializers.DictField(), source='get_liked_user', read_only=True)
    created_on = serializers.DateTimeField(source="get_datetime", read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post 
        fields = '__all__'

    def get_comments(self, obj):
        comments = obj.comments.all().filter(post=obj).all()
        # comments = obj.comments.all().filter(post=obj).order_by('-created_on')
        comment_list = []
        for comment in comments:
            comment_dict = {}
            comment_dict['id'] = comment.id
            comment_dict['auther'] = comment.user.username
            comment_dict['profile_picture'] = comment.user.profile.profile_picture.url 
            comment_dict['comment'] = comment.comment
            comment_dict['likes'] = len(comment.likes.all())
            comment_dict['created_on'] = comment.created_on
            comment_dict['isReplyComment'] = True if comment.sub_comment else False
            if comment_dict['isReplyComment']:
                comment_dict['parentComment'] = comment.sub_comment.id
            
            comment_list.append(comment_dict)
            del comment_dict
        return comment_list


class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.ListField(child=serializers.DictField(), source='get_followers', read_only=True)
    followings = serializers.ListField(child=serializers.DictField(), source='get_followings', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'profile_picture', 'followers', 'followings', 'bio', 'birthday', 'location', 'slug']
        read_only_fields = ['slug', 'birthday']



class CommentSerializer(serializers.ModelSerializer):
    likes = serializers.ListField(child=serializers.DictField(), source='get_likes', read_only=True)

    class Meta:
        model = Comment 
        fields = ['id', 'user', 'post', 'comment', 'sub_comment', 'likes', 'created_on']


class PasswordResetSerailizer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']


# new password serializer
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=8, style={'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(min_length=8, style={'input_type': 'password'}, write_only=True)
    uid = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    class Meta:
        fields = ['uid', 'token', 'password', 'confirm_password']

         
    def validate(self, validated_data):
        password = validated_data.get('password')
        confirm_password = validated_data.get('confirm_password')
        uid = validated_data.get('uid')
        token = validated_data.get('token')

        if uid is None or token is None:
            raise serializers.ValidationError("Uid and token missing")

        if not password == confirm_password:
            raise serializers.ValidationError("Comfirm password didn't match")
        
        user_id = smart_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        if user is None:
            raise serializers.ValidationError("User is not found")
        
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("Token is invalid, please request another token")

        # update password
        user.set_password(password)
        user.save()
    
        return super().validate(validated_data) 


class UpdateUserPasswordSerializer(serializers.Serializer):
    print("hello world")
    old_password = serializers.CharField(min_length=8, style={'input-type': 'password'}, write_only=True)
    new_password = serializers.CharField(min_length=8, style={'input-type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(min_length=8, style={'input-type': 'password'}, write_only=True)

    class Meta:
        fields = ['old_password', 'new_password', 'confirm_password']

    def validate(self, validated_data):
        old_password = validated_data['old_password']
        new_password = validated_data['new_password']
        confirm_password = validated_data['confirm_password']
        current_user = self.context['user']

        if (current_user.check_password(old_password) and new_password == confirm_password):
            current_user.set_password(new_password)
            current_user.save()
        else:
            raise serializers.ValidationError("Invalid credentials")
        
        return validated_data


# serailizer to update user's info
class UpdateUserInfoSerializer(serializers.Serializer):
    name = serializers.CharField(write_only=True)
    location = serializers.CharField(write_only=True)
    bio = serializers.CharField(write_only=True)
    profile_picture = serializers.ImageField(write_only=True)

    class Meta:
        fields = ['name', 'location', 'bio', 'profile_picture']
        

    def validate(self, validated_data):
        name = validated_data['name']
        location = validated_data['location']
        bio = validated_data['bio']
        profile_picture = validated_data['profile_picture']

        user = self.context['user']
        user_profile = self.context['user_profile']

        user.username = name
        user_profile.name = name 
        user_profile.location = location
        user_profile.bio = bio
        user_profile.profile_picture = profile_picture 

        user.save()
        user_profile.save()

        return validated_data
    


        
