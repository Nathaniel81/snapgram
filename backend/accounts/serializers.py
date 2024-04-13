from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class UserSerializer(serializers.ModelSerializer):
    isAdmin = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'isAdmin', 'profile_picture']

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get__id(self, obj):
        return obj.id
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializer(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirmPassword = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    tokens = serializers.SerializerMethodField(read_only=True)
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'password', 'confirmPassword', 'tokens', 'token']
        read_only_fields = ['id']

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def save(self, validated_data):
        validated_data.pop('confirmPassword')
        user = User.objects.create(
            name=validated_data['name'],
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        
        validated_data['id'] = user.id

        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        validated_data['access_token'] = access_token
        validated_data['refresh_token'] = refresh_token

        return validated_data
