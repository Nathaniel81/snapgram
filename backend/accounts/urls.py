from django.urls import path
from . import views
    
urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.RegistrationView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='token_refresh'),
    path('update/', views.UserUpdateView.as_view(), name='users_update'),
    path('<str:pk>/', views.GetUserView.as_view(), name='user'),
    path('', views.UserListView.as_view(), name='users_list'),
]
