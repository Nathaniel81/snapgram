from django.urls import path
from . import views
    
urlpatterns = [
	path('<int:pk>/', views.PostRetrieveUpdateDestroyView.as_view(), name='post_detail'),
	path('create/', views.PostCreateView.as_view(), name='post_create'),
	path('recent/', views.RecentPostsView.as_view(), name='recent_posts'),
	path('<int:pk>/like/', views.LikePostView.as_view(), name='like_post'),
    path('<int:pk>/unlike/', views.UnlikePostView.as_view(), name='unlike_post'),
	path('<int:pk>/save/', views.SavePostView.as_view(), name='save_post'),
    path('<int:pk>/unsave/',views.UnsavePostView.as_view(), name='unsave_post'),
]
