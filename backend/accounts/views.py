from django.conf import settings
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import MyTokenObtainPairSerializer, RegistrationSerializer


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

class LogoutView(APIView):
    # Handle POST requests for logging out users
    def post(self, request):
        try:
            refreshToken = request.COOKIES.get(
                settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            token = tokens.RefreshToken(refreshToken)
            token.blacklist()

            response = Response({'LoggedOut'})
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            # response.delete_cookie("X-CSRFToken")
            # response.delete_cookie("csrftoken")
            # response["X-CSRFToken"]=None
        
            return response
        except tokens.TokenError as e:
            response = Response({'LoggedOut'})
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            # response.delete_cookie("X-CSRFToken")
            # response.delete_cookie("csrftoken")
            # response["X-CSRFToken"]=None
        
            return response
        except Exception as e:
            raise exceptions.ParseError("Invalid token")
