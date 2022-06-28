from django.contrib.auth import authenticate
from django.contrib.auth.models import User
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
        comments = obj.comments.all().filter(post=obj).order_by('-created_on')
        comment_list = []
        for comment in comments:
            comment_dict = {}
            comment_dict['id'] = comment.id
            comment_dict['auther'] = comment.user.username
            comment_dict['profile_picture'] = comment.user.profile.profile_picture.url 
            comment_dict['comment'] = comment.comment
            comment_dict['likes'] = len(comment.likes.all())
            comment_dict['created_on'] = comment.created_on
            # comment_dict['is_sub_comment'] = comment.is_sub_comment
            # comment_dict['sub_comment'] = comment.sub_comment.sub_comment


            # add sub_comment in the comment json response
            # sub_comments = comment.all_sub_comments()
            # sub_comment_list = []
            # for sub_comment in sub_comments:
            #     sub_comment_dict={}
            #     sub_comment_dict['id'] = sub_comment.id
            #     sub_comment_dict['auther'] = sub_comment.user.username
            #     sub_comment_dict['profile_picture'] = sub_comment.user.profile.profile_picture.url
            #     sub_comment_dict['created_on'] = sub_comment.created_on
            #     sub_comment_dict['likes'] = len(sub_comment.likes.all())
            #     sub_comment_list.append(sub_comment_dict)
            #     del sub_comment_dict

            comment_list.append(comment_dict)
            # comment_list.append(sub_comment_list)
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





