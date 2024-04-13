from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView

from django.conf import settings
from .models import User
from .serializers import MyTokenObtainPairSerializer, RegistrationSerializer
from rest_framework.response import Response


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            # Set httponly flag for access and refresh tokens
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=refresh_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
        return response

class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializedData = serializer.save(serializer.validated_data)

        response = Response({
            'response': 'Successfully registered',
            'id': serializedData['id'],
            'username': serializedData['username'],
            'name': serializedData['name'],
            'email': serializedData['email'],
        })
        access_token =  serializedData.get('access_token')
        refresh_token =  serializedData.get('refresh_token')

        response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )
        response.set_cookie(
               key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
               value=refresh_token,
               expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
               secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
               httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
               samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        return response
