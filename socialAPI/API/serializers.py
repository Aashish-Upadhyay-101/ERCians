from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post


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
    created_on = serializers.DateTimeField(source="get_datetime", read_only=True)
    class Meta:
        model = Post 
        fields = '__all__'




        



