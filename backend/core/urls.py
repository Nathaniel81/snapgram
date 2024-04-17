from django.urls import path
from . import views
    
urlpatterns = [
	# path('', views.PostRetrieveUpdateDestroyView.as_view(), name='post'),
	path('create/', views.PostCreateView.as_view(), name='post-create'),
	path('recent/', views.RecentPostsView.as_view(), name='recent-posts'),
	path('<int:pk>/like/', views.LikePostView.as_view(), name='like_post'),
    path('<int:pk>/unlike/', views.UnlikePostView.as_view(), name='unlike_post'),
	path('<int:pk>/save/', views.SavePostView.as_view(), name='save_post'),
    path('<int:pk>/unsave/',views.UnsavePostView.as_view(), name='unsave_post'),
]
